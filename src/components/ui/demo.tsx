import { AuroraCanvas } from "./ambient-aurora";
import { Button } from "./button";

export const AuroraDemo = () => {
  return (
    <div className="relative h-[650px] rounded-xl overflow-hidden border border-[#241735] bg-[#0b0613]">
      {/* Aurora background layer */}
      <AuroraCanvas speed={0.008} intensity={0.3} tint="#6b4bff" grain={0.08} />
      
      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 text-center">
        <h1 className="text-5xl font-bold mb-6" style={{ color: "#c8b8ff" }}>
          Ambient Aurora Background
        </h1>
        <p className="text-lg mb-8 max-w-2xl" style={{ color: "#9b8bc4" }}>
          A premium, dark purple ambient background with slow motion and subtle grain.
          Perfect for hero sections and immersive experiences.
        </p>
        <Button 
          size="lg"
          style={{ 
            backgroundColor: "#7a5bff",
            color: "white"
          }}
          className="hover:opacity-90 transition-opacity"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};
