import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  href, 
  as = 'button',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-body rounded-full transition-all duration-500 min-h-[44px] px-8 text-sm uppercase tracking-wider font-bold shrink-0";
  
  const variants = {
    primary: "bg-gradient-to-r from-secondary to-primary text-white shadow-[0_0_20px_-5px_rgba(234,88,12,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(247,147,26,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-sm",
    outline: "bg-white/[0.04] backdrop-blur-xl border border-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-white/[0.08] hover:border-white/[0.2] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]",
    ghost: "bg-transparent border-none text-white hover:bg-white/[0.06] hover:text-primary",
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
