import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import CLOUDS from "vanta/dist/vanta.clouds.min";

const AuthLayout = ({ children, title, subtitle }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      try {
        const effect = CLOUDS({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          skyColor: 0x68b8d7, // Light blue sky
          cloudColor: 0xadc1de, // White/Greyish clouds
          cloudShadowColor: 0x183550, // Darker shadow for depth
          sunColor: 0xff9919, // Warm sun 
          sunGlareColor: 0xff6633, 
          sunlightColor: 0xff9933,
          speed: 1.0, // Gentle movement
        });
        setVantaEffect(effect);
      } catch (error) {
        console.error("Failed to initialize Vanta effect:", error);
      }
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="min-h-screen w-full flex items-center justify-center p-4 overflow-hidden relative"
    >
      {/* Content Container with Glassmorphism */}
      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-2xl overflow-hidden p-6 md:p-8 transition-all duration-300 hover:shadow-3xl hover:bg-white/75">
          {(title || subtitle) && (
            <div className="text-center mb-6 space-y-2">
              {title && (
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-slate-600 font-medium">{subtitle}</p>
              )}
            </div>
          )}
          {children}
        </div>
        
        {/* Footer/Brand mark option */}
        <div className="mt-6 text-center">
           <p className="text-xs text-white/80 font-medium drop-shadow-sm">
             Blog Application &copy; 2026
           </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
