import React from "react";

const badgeVariants = {
  default: "inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 text-white px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap gap-1 transition-colors",
  secondary: "inline-flex items-center justify-center rounded-md border border-transparent bg-gray-700 text-gray-200 px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap gap-1 transition-colors",
  destructive: "inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 text-white px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap gap-1 transition-colors",
  outline: "inline-flex items-center justify-center rounded-md border border-gray-400 text-gray-800 px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap gap-1 transition-colors",
};

const Badge = ({ className = "", variant = "default", children, ...props }) => {
  return (
    <span
      className={`${badgeVariants[variant] || badgeVariants.default} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge }; 