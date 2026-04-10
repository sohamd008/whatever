import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  href, 
  as = 'button',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-body rounded-full transition-all duration-300 min-h-[44px] px-8 text-sm uppercase tracking-wider font-bold shrink-0";
  
  const variants = {
    primary: "bg-gradient-to-r from-secondary to-primary text-white shadow-orange-glow hover:scale-105 hover:shadow-orange-glow-hover",
    outline: "bg-transparent border-2 border-white/20 text-white hover:border-white hover:bg-white/10",
    ghost: "bg-transparent border-none text-white hover:bg-white/10 hover:text-primary",
  };

  const Component = href ? 'a' : as;
  
  let finalHref = href;
  if (href && href.trim().toLowerCase().startsWith('javascript:')) {
    finalHref = '#';
  }

  const isExternal = finalHref && (finalHref.startsWith('http') || finalHref.startsWith('//'));
  const hrefProps = finalHref ? { 
    href: finalHref, 
    ...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {}) 
  } : {};

  return (
    <Component 
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`}
      {...hrefProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
