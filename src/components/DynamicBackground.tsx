import { ShaderAnimation } from "@/components/ui/shader-animation";
import { AuroraBackground } from "@/components/ui/aurora-background";

const DynamicBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Base layer: Three.js shader animation */}
      <div className="absolute inset-0 will-change-transform">
        <ShaderAnimation 
          speed={0.003} 
          grain={0.12} 
          tint="#8b5cf6"
          className="w-full h-full"
        />
      </div>
      
      {/* Middle layer: Aurora gradient animation with semi-transparency */}
      <div className="absolute inset-0 opacity-40 will-change-transform">
        <AuroraBackground showRadialGradient={true}>
          <div />
        </AuroraBackground>
      </div>
      
      {/* Top layer: Heavy grain texture overlay */}
      <div 
        className="absolute inset-0 opacity-60 mix-blend-mode-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 800 800' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.5' numOctaves='8' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  );
};

export default DynamicBackground;
