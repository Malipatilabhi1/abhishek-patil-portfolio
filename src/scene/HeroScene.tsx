import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, type RefObject } from 'react'
import {
  AdditiveBlending, BufferAttribute, NormalBlending, BufferGeometry, CanvasTexture, MathUtils, SRGBColorSpace,
  type Group, type Mesh, type MeshBasicMaterial,
} from 'three'
import type { HeroPointer } from '../hero/useHeroPointer'
import { queries, useMediaQuery } from '../useMediaQuery'
import { createStudioReflection, monogramDepth, monogramShape } from './monogram'

export type SceneProps = {
  frame: RefObject<HTMLDivElement | null>
  pointer: HeroPointer
  /** False while the hero is off-screen or the tab is hidden: rendering stops entirely. */
  active: boolean
  light: boolean
  onReady: () => void
  onFailure: () => void
}

type Inputs = {
  reduceMotion: boolean
  finePointer: boolean
}

/** Max tilt toward the cursor: ~18° yaw, ~14° pitch. */
const MAX_YAW = MathUtils.degToRad(18)
const MAX_PITCH = MathUtils.degToRad(14)
const REST_YAW = -0.22
const REST_PITCH = 0.08
const STIFFNESS = 38
const DAMPING = 2 * Math.sqrt(STIFFNESS) * 0.72
const ENTRANCE_DURATION = 1.45

type Spring = { value: number; velocity: number }

function stepSpring(spring: Spring, target: number, dt: number) {
  const force = (target - spring.value) * STIFFNESS - spring.velocity * DAMPING
  spring.velocity += force * dt
  spring.value += spring.velocity * dt
  if (Math.abs(spring.value - target) > 0.001 || Math.abs(spring.velocity) > 0.004) return true
  spring.value = target
  spring.velocity = 0
  return false
}

function createShadowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const context = canvas.getContext('2d')
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(0,0,0,0.55)')
    gradient.addColorStop(0.45, 'rgba(0,0,0,0.22)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

function createParticles(count: number) {
  const positions = new Float32Array(count * 3)
  // Deterministic pseudo-random so the field is identical on every load.
  let seed = 7
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  for (let index = 0; index < count; index++) {
    const radius = 2.3 + random() * 1.5
    const theta = random() * Math.PI * 2
    const phi = Math.acos(2 * random() - 1)
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[index * 3 + 1] = radius * Math.cos(phi) * 0.8
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 0.6
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  return geometry
}

function useDeviceTilt(enabled: boolean, wake: () => void) {
  const tilt = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!enabled || typeof DeviceOrientationEvent === 'undefined') return
    // iOS requires an explicit permission prompt; skip tilt there rather than nag the visitor.
    const needsPermission = typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === 'function'
    if (needsPermission) return

    function orient(event: DeviceOrientationEvent) {
      if (document.hidden || event.gamma === null || event.beta === null) return
      const x = MathUtils.clamp(event.gamma / 35, -1, 1)
      const y = MathUtils.clamp((event.beta - 45) / 35, -1, 1)
      const previous = tilt.current
      // Ignore sensor noise so a stationary device can stay idle.
      if (previous && Math.abs(previous.x - x) < 0.04 && Math.abs(previous.y - y) < 0.04) return
      tilt.current = { x, y }
      wake()
    }
    window.addEventListener('deviceorientation', orient)
    return () => {
      window.removeEventListener('deviceorientation', orient)
      tilt.current = null
    }
  }, [enabled, wake])

  return tilt
}

function useTouchDrag(frame: RefObject<HTMLDivElement | null>, enabled: boolean, wake: () => void) {
  const drag = useRef({ offset: 0, active: false })

  useEffect(() => {
    const element = frame.current
    if (!element || !enabled) return
    const gesture = drag.current
    let startX = 0
    let startOffset = 0
    let pointerId = -1

    function down(event: PointerEvent) {
      if (event.pointerType === 'mouse' || !event.isPrimary || document.hidden) return
      pointerId = event.pointerId
      startX = event.clientX
      startOffset = gesture.offset
      gesture.active = true
    }
    function move(event: PointerEvent) {
      if (event.pointerId !== pointerId) return
      gesture.offset = startOffset + (event.clientX - startX) * 0.012
      wake()
    }
    function up(event: PointerEvent) {
      if (event.pointerId !== pointerId) return
      pointerId = -1
      gesture.active = false
      wake()
    }

    element.addEventListener('pointerdown', down)
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerup', up)
    element.addEventListener('pointercancel', up)
    element.addEventListener('lostpointercapture', up)
    return () => {
      element.removeEventListener('pointerdown', down)
      element.removeEventListener('pointermove', move)
      element.removeEventListener('pointerup', up)
      element.removeEventListener('pointercancel', up)
      element.removeEventListener('lostpointercapture', up)
      gesture.offset = 0
      gesture.active = false
    }
  }, [frame, enabled, wake])

  return (dt: number) => {
    const gesture = drag.current
    if (!gesture.active) {
      gesture.offset = MathUtils.damp(gesture.offset, 0, 4, dt)
      if (Math.abs(gesture.offset) <= 0.002) gesture.offset = 0
    }
    return { offset: gesture.offset, releasing: !gesture.active && gesture.offset !== 0 }
  }
}

function Monogram({ frame, pointer, active, light, onReady, onFailure, reduceMotion, finePointer }: SceneProps & Inputs) {
  const group = useRef<Group>(null)
  const ring = useRef<Mesh>(null)
  const particles = useRef<Group>(null)
  const shadow = useRef<Mesh>(null)
  const entrance = useRef(reduceMotion ? ENTRANCE_DURATION : 0)
  const firstFrame = useRef(true)
  const yaw = useRef<Spring>({ value: reduceMotion ? REST_YAW : -1.5, velocity: 0 })
  const pitch = useRef<Spring>({ value: REST_PITCH, velocity: 0 })
  const scale = useRef<Spring>({ value: reduceMotion ? 1 : 0.7, velocity: 0 })
  const environment = useMemo(() => createStudioReflection(), [])
  const shadowTexture = useMemo(() => createShadowTexture(), [])
  const particleGeometry = useMemo(() => createParticles(finePointer ? 170 : 90), [finePointer])
  const { gl, viewport, invalidate } = useThree()
  const deviceTilt = useDeviceTilt(active && !finePointer && !reduceMotion, invalidate)
  const sampleDrag = useTouchDrag(frame, active && !finePointer && !reduceMotion, invalidate)
  const { state: pointerState, subscribe } = pointer
  // Kept small enough that the A stays inside the central band of the visual,
  // leaving the corners free for the floating cards (see .card-* in index.css).
  const sceneScale = Math.min(0.64, viewport.width / 7)

  useEffect(() => {
    if (active && finePointer && !reduceMotion) return subscribe(invalidate)
  }, [active, finePointer, reduceMotion, invalidate, subscribe])

  useEffect(() => {
    if (active) invalidate()
  }, [active, light, reduceMotion, finePointer, viewport.width, viewport.height, invalidate])

  useEffect(() => () => {
    environment.dispose()
    shadowTexture.dispose()
  }, [environment, shadowTexture])

  useEffect(() => () => particleGeometry.dispose(), [particleGeometry])

  useEffect(() => {
    const canvas = gl.domElement
    function contextLost(event: Event) {
      event.preventDefault()
      onFailure()
    }
    canvas.addEventListener('webglcontextlost', contextLost)
    return () => canvas.removeEventListener('webglcontextlost', contextLost)
  }, [gl, onFailure])

  useFrame((_, delta) => {
    const model = group.current
    if (!model || !active || document.hidden) return
    if (firstFrame.current) {
      firstFrame.current = false
      queueMicrotask(onReady)
    }
    const dt = Math.min(delta, 1 / 30)
    entrance.current = reduceMotion ? ENTRANCE_DURATION : Math.min(ENTRANCE_DURATION, entrance.current + dt)
    const t = entrance.current
    const entering = t < ENTRANCE_DURATION
    const fade = 1 - t / ENTRANCE_DURATION
    let targetYaw = REST_YAW
    let targetPitch = REST_PITCH
    let releasing = false

    const state = pointerState.current
    if (!reduceMotion && finePointer && state.engaged) {
      targetYaw = state.x * MAX_YAW
      targetPitch = state.y * MAX_PITCH
    } else if (!reduceMotion && !finePointer) {
      const tilt = deviceTilt.current
      if (tilt) {
        targetYaw += tilt.x * MAX_YAW
        targetPitch += tilt.y * MAX_PITCH
      }
      const drag = sampleDrag(dt)
      releasing = drag.releasing
      targetYaw += drag.offset
    }

    let settling = false
    if (reduceMotion) {
      yaw.current = { value: REST_YAW, velocity: 0 }
      pitch.current = { value: REST_PITCH, velocity: 0 }
      scale.current = { value: 1, velocity: 0 }
    } else {
      const yawMoving = stepSpring(yaw.current, targetYaw, dt)
      const pitchMoving = stepSpring(pitch.current, targetPitch, dt)
      const scaleMoving = stepSpring(scale.current, 1, dt)
      settling = yawMoving || pitchMoving || scaleMoving
    }

    const bob = Math.sin(t * 1.1) * 0.09 * fade
    model.rotation.set(pitch.current.value, yaw.current.value, Math.sin(t * 0.7) * 0.025 * fade)
    model.position.y = bob
    model.scale.setScalar(scale.current.value)

    if (shadow.current) {
      const lift = (bob + 0.09) / 0.18
      shadow.current.scale.setScalar(1 - lift * 0.14)
      ;(shadow.current.material as MeshBasicMaterial).opacity = (light ? 0.42 : 0.7) - lift * 0.18
    }
    if (entering || settling || releasing) {
      if (ring.current) ring.current.rotation.z += dt * 0.12
      if (particles.current) particles.current.rotation.y += dt * 0.035
      invalidate()
    }
  })

  const metal = light ? '#3fb3a6' : '#8fe6dc'
  const accent = light ? '#0e8f86' : '#5eead4'

  return (
    <>
      <primitive object={environment} attach="environment" />
      <ambientLight intensity={light ? 0.9 : 0.6} color="#c9e7ec" />
      <directionalLight position={[-3, 5, 7]} intensity={3} color="#fff4e6" />
      <directionalLight position={[4, 1, 2]} intensity={2.4} color="#3ee7d6" />
      <directionalLight position={[0, 3, -4]} intensity={2} color="#b4e1ff" />
      <pointLight position={[-1.8, 2.4, 3]} intensity={10} color="#fff3e3" />
      <group scale={sceneScale}>
        <group ref={group} rotation={[REST_PITCH, REST_YAW, 0]}>
          {/* Offsets centre the bevelled glyph (y −1.4…1.53, z −0.06…0.4) on the origin. */}
          <mesh position={[0, -0.065, -0.17]}>
            <extrudeGeometry args={[monogramShape, monogramDepth]} />
            <meshStandardMaterial color={metal} metalness={0.86} roughness={0.26} envMapIntensity={1.55} />
          </mesh>
        </group>
        <mesh ref={ring} rotation={[1.2, 0.18, 0]}>
          <torusGeometry args={[2.25, 0.006, 6, 160]} />
          <meshBasicMaterial color={accent} transparent opacity={light ? 0.35 : 0.4} toneMapped={false} />
        </mesh>
        <group ref={particles}>
          <points geometry={particleGeometry}>
            <pointsMaterial color={accent} size={0.03} sizeAttenuation transparent opacity={light ? 0.5 : 0.65}
              depthWrite={false} blending={light ? NormalBlending : AdditiveBlending} toneMapped={false}
            />
          </points>
        </group>
        <mesh ref={shadow} position={[0, -1.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.4, 1.4]} />
          <meshBasicMaterial map={shadowTexture} transparent depthWrite={false} opacity={0.6} />
        </mesh>
      </group>
    </>
  )
}

export default function HeroScene(props: SceneProps) {
  const reduceMotion = useMediaQuery(queries.reducedMotion)
  const finePointer = useMediaQuery(queries.finePointer)

  return (
    <div className="scene-layer">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 35 }}
        dpr={[1, 1.75]}
        frameloop={props.active ? 'demand' : 'never'}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
        aria-hidden="true"
        style={{ pointerEvents: 'none' }}
      >
        <Monogram {...props} reduceMotion={reduceMotion} finePointer={finePointer} />
      </Canvas>
    </div>
  )
}
