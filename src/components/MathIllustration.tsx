
import React from 'react';

const MathIllustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-md aspect-square">
      <div className="absolute inset-0 bg-gradient-to-br from-softPink to-softBlue rounded-full opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Plus symbol */}
          <circle cx="75" cy="75" r="40" className="fill-mathPurple/90" />
          <path d="M75 55V95M55 75H95" stroke="white" strokeWidth="6" strokeLinecap="round" />
          
          {/* Minus symbol */}
          <circle cx="225" cy="75" r="40" className="fill-mathBlue/90" />
          <path d="M205 75H245" stroke="white" strokeWidth="6" strokeLinecap="round" />
          
          {/* Multiply symbol */}
          <circle cx="75" cy="225" r="40" className="fill-mathOrange/90" />
          <path d="M60 210L90 240M90 210L60 240" stroke="white" strokeWidth="6" strokeLinecap="round" />
          
          {/* Divide symbol */}
          <circle cx="225" cy="225" r="40" className="fill-mathGreen/90" />
          <circle cx="225" cy="210" r="5" fill="white" />
          <path d="M205 225H245" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <circle cx="225" cy="240" r="5" fill="white" />
          
          {/* Connecting lines */}
          <path d="M115 75H185" stroke="#9b87f5" strokeWidth="3" strokeDasharray="6 3" />
          <path d="M225 115V185" stroke="#1EAEDB" strokeWidth="3" strokeDasharray="6 3" />
          <path d="M185 225H115" stroke="#F97316" strokeWidth="3" strokeDasharray="6 3" />
          <path d="M75 185V115" stroke="#10B981" strokeWidth="3" strokeDasharray="6 3" />
          
          {/* Center node */}
          <circle cx="150" cy="150" r="30" className="fill-white shadow-lg" />
          <path d="M140 150H160M150 140V160" stroke="#9b87f5" strokeWidth="4" />
        </svg>
      </div>
      
      {/* Floating math symbols */}
      <div className="absolute -top-4 right-10 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md animate-bounce">
        <span className="text-xl font-bold text-mathBlue">÷</span>
      </div>
      <div className="absolute top-20 -right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md animate-bounce" style={{ animationDelay: "0.4s" }}>
        <span className="text-xl font-bold text-mathPurple">+</span>
      </div>
      <div className="absolute -left-2 top-40 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md animate-bounce" style={{ animationDelay: "0.8s" }}>
        <span className="text-xl font-bold text-mathOrange">×</span>
      </div>
      <div className="absolute bottom-10 left-10 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow-md animate-bounce" style={{ animationDelay: "1.2s" }}>
        <span className="text-xl font-bold text-mathGreen">-</span>
      </div>
    </div>
  );
};

export default MathIllustration;
