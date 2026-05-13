import React from 'react';

const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-700',
    secondary: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    gray: 'bg-gray-200 text-gray-700',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs font-medium rounded',
    md: 'px-3 py-1 text-sm font-medium rounded-md',
    lg: 'px-4 py-1.5 text-base font-medium rounded-md',
  };

  const variantStyle = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  return (
    <span className={`inline-flex items-center ${variantStyle} ${sizeStyle} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
