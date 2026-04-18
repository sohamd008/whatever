import React from 'react';

const Card = ({ 
  children, 
  className = '',
  glass = false,
  highlight = false,
  ...props 
}) => {
  const baseStyles = "rounded-2xl p-8 transition-all duration-500 group";
  
  const backgroundStyles = glass 
    ? "bg-white/[0.04] backdrop-blur-2xl border border-white/[0.1]" 
    : "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]";
    
  const shadowStyles = glass
    ? "shadow-[0_8px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]"
    : "shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]";
    
  const hoverStyles = "hover:-translate-y-1 hover:bg-white/[0.06] hover:border-white/[0.14] hover:shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_60px_-10px_rgba(247,147,26,0.1),inset_0_1px_0_rgba(255,255,255,0.08)]";
  const highlightStyles = highlight ? "border-primary/30 shadow-[0_0_50px_-10px_rgba(247,147,26,0.15)] z-10" : "";

  return (
    <div 
      className={`${baseStyles} ${backgroundStyles} ${shadowStyles} ${hoverStyles} ${highlightStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
