import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Stem & Leaves - Bright Green */}
      <path 
        d="M50 95V65" 
        stroke="#22C55E" 
        strokeWidth="4" 
        strokeLinecap="round" 
      />
      <path 
        d="M50 80C50 80 35 75 30 65" 
        stroke="#22C55E" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
      <path 
        d="M50 85C50 85 65 80 70 70" 
        stroke="#22C55E" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
      
      {/* Outer Petals - Blooming Effect (Deep Purple) */}
      <circle cx="50" cy="45" r="22" fill="#4e1952" opacity="0.2" />
      
      {/* Symmetrical blooming petals */}
      <g className="animate-pulse">
        <path d="M50 45C50 45 30 35 30 20C30 5 50 5 50 20V45Z" fill="#4e1952" />
        <path d="M50 45C50 45 70 35 70 20C70 5 50 5 50 20V45Z" fill="#7A3B84" />
        
        <path d="M50 45C50 45 35 55 20 55C5 55 5 40 20 40H50V45Z" fill="#4e1952" opacity="0.8" />
        <path d="M50 45C50 45 65 55 80 55C95 55 95 40 80 40H50V45Z" fill="#7A3B84" opacity="0.8" />
        
        <path d="M50 45C50 45 40 65 50 75C60 65 50 45 50 45Z" fill="#4e1952" opacity="0.9" />
      </g>

      {/* Core - The Seed/Growth Point */}
      <circle cx="50" cy="45" r="6" fill="#22C55E" />
    </svg>
  );
};

export default Logo;