import React from "react";

const buttonVariants = {
  default:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-blue-600 text-white shadow-xs hover:bg-blue-700 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
  destructive:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-red-600 text-white shadow-xs hover:bg-red-700 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-red-400",
  outline:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border border-gray-400 bg-transparent text-gray-800 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
  secondary:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
  ghost:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-transparent text-gray-700 hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
  link:
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all text-blue-600 underline-offset-4 hover:underline bg-transparent",
};

const buttonSizes = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 py-1.5 text-sm",
  lg: "h-10 rounded-md px-6 py-2 text-base",
  icon: "h-9 w-9 p-0",
};

const Button = ({
  className = "",
  variant = "default",
  size = "default",
  children,
  ...props
}) => {
  return (
    <button
      className={`${buttonVariants[variant] || buttonVariants.default} ${buttonSizes[size] || buttonSizes.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button }; 