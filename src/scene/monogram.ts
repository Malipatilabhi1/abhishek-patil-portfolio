import { DataTexture, EquirectangularReflectionMapping, Path, Shape, SRGBColorSpace } from 'three'

export const monogramShape = new Shape()
monogramShape.moveTo(-1.39, -1.35)
monogramShape.lineTo(-0.32, 1.48)
monogramShape.lineTo(0.32, 1.48)
monogramShape.lineTo(1.39, -1.35)
monogramShape.lineTo(0.79, -1.35)
monogramShape.lineTo(0.54, -0.68)
monogramShape.lineTo(-0.54, -0.68)
monogramShape.lineTo(-0.79, -1.35)
monogramShape.closePath()

const aperture = new Path()
aperture.moveTo(-0.33, -0.18)
aperture.lineTo(0.33, -0.18)
aperture.lineTo(0, 0.76)
aperture.closePath()
monogramShape.holes.push(aperture)

export const monogramDepth = {
  depth: 0.34,
  bevelEnabled: true,
  bevelThickness: 0.06,
  bevelSize: 0.045,
  bevelSegments: 3,
  steps: 1,
}

// A small local reflection map with broad studio lights and a cool edge light.
export function createStudioReflection() {
  const width = 128
  const height = 64
  const data = new Uint8Array(width * height * 4)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = x / width
      const v = y / height
      const key = Math.exp(-(((u - 0.28) / 0.19) ** 2 + ((v - 0.72) / 0.21) ** 2))
      const rim = Math.exp(-(((u - 0.77) / 0.11) ** 2 + ((v - 0.53) / 0.32) ** 2))
      const ambient = 36 + 30 * v
      const index = (y * width + x) * 4
      data[index] = Math.min(255, ambient + key * 202 + rim * 15)
      data[index + 1] = Math.min(255, ambient + key * 195 + rim * 89)
      data[index + 2] = Math.min(255, ambient + key * 181 + rim * 132)
      data[index + 3] = 255
    }
  }

  const texture = new DataTexture(data, width, height)
  texture.mapping = EquirectangularReflectionMapping
  texture.colorSpace = SRGBColorSpace
  texture.needsUpdate = true
  return texture
}
