import { SplineScene } from "@/components/ui/splite"
import { Card } from "@/components/ui/card"

export function SplineSceneBasic() {
  return (
    <Card className="relative w-full h-[560px] overflow-hidden rounded-2xl border border-[#241735] bg-[#0b0613]">
      {/* Robot: passive, no interactivity */}
      <div className="absolute inset-0 -z-0 opacity-90">
        <SplineScene scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" className="w-full h-full" />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="px-8 md:px-12">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#c8b8ff]">3D Robot Visual</h1>
          <p className="mt-4 max-w-xl text-sm md:text-base text-[#b2a4ea]">
            Passive Spline render. No hover or click effects. Dark purple theme.
          </p>
        </div>
      </div>
    </Card>
  )
}
