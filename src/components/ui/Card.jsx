import React from 'react';

const Card = ({ 
  children, 
  className = '',
  glass = false,
  highlight = false,
  ...props 
}) => {
  const baseStyles = "rounded-2xl p-8 transition-all duration-300 group";
  
  const backgroundStyles = glass 
    ? "bg-black/40 backdrop-blur-lg border border-white/10" 
    : "bg-surface border border-white/10";
    
  const hoverStyles = "hover:-translate-y-1 hover:border-primary/50 hover:shadow-elevation";
  const highlightStyles = highlight ? "border-primary shadow-elevation z-10" : "";

  return (
    <div 
      className={`${baseStyles} ${backgroundStyles} ${hoverStyles} ${highlightStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
