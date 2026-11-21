import {
  siAngular, siBitbucket, siCss, siDocker, siExpress, siGit, siHtml5, siJavascript, siLinux, siMui, siMysql,
  siNextdotjs, siNginx, siNodedotjs, siPm2, siPostman, siReact, siReactivex, siRedux, siTypescript,
  type SimpleIcon,
} from 'simple-icons'

/**
 * Logos for skill chips, keyed by the names used in content.ts `skills`.
 * Verified against simple-icons 16.38.0. Brands without an icon there (Oracle, IBM MQ,
 * Angular Material) or without an exact match (WebSockets, SQL, REST APIs, SWIFT) render
 * as text-only chips. CSS3 uses the renamed `siCss`; Redux Toolkit uses the Redux logo;
 * RxJS uses its ReactiveX family logo.
 */
export const skillIcons: Readonly<Record<string, SimpleIcon | undefined>> = {
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  HTML5: siHtml5,
  CSS3: siCss,
  React: siReact,
  Angular: siAngular,
  'Next.js': siNextdotjs,
  'Material UI': siMui,
  'Redux Toolkit': siRedux,
  RxJS: siReactivex,
  'Node.js': siNodedotjs,
  Express: siExpress,
  MySQL: siMysql,
  Docker: siDocker,
  NGINX: siNginx,
  PM2: siPm2,
  Linux: siLinux,
  Git: siGit,
  Bitbucket: siBitbucket,
  Postman: siPostman,
}
