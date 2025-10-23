import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

/** Non-interactive Spline wrapper */
export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className={['relative w-full h-full pointer-events-none select-none', className].filter(Boolean).join(' ')}>
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="h-3 w-3 rounded-full bg-[#6b4bff]/40 animate-pulse"></span>
          </div>
        }
      >
        <Spline scene={scene} className="absolute inset-0 !pointer-events-none" aria-hidden="true" tabIndex={-1} />
      </Suspense>
    </div>
  )
}
