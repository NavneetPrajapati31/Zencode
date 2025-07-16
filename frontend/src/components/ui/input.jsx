import React from "react";

const Input = ({ className = "", type = "text", ...props }) => (
  <input
    type={type}
    className={`flex h-9 w-full min-w-0 rounded-md border border-zinc-600 bg-zinc-800 px-3 py-1 text-base text-zinc-100 placeholder:text-zinc-400 shadow-xs transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none disabled:pointer-events-none disabled:opacity-50 md:text-sm ${className}`}
    {...props}
  />
);

export { Input };
