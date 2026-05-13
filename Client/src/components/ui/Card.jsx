import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-250 hover:shadow-lg ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
