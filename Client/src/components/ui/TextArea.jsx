import React from 'react';

const TextArea = React.forwardRef(({
  label,
  error,
  placeholder,
  disabled = false,
  rows = 5,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-250 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
