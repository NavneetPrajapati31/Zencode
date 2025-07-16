import React, { useState, useRef, useEffect } from "react";

const DropdownMenu = ({ children }) => {
  return <div className="relative inline-block">{children}</div>;
};

const DropdownMenuTrigger = ({ children, className = "", ...props }) => {
  return (
    <button type="button" className={className} {...props}>
      {children}
    </button>
  );
};

const DropdownMenuContent = ({
  open,
  onClose,
  className = "",
  children,
  ...props
}) => {
  const ref = useRef();
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      ref={ref}
      className={`absolute z-50 mt-2 min-w-[8rem] rounded-md border bg-zinc-700 text-zinc-100 shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, className = "", onClick, ...props }) => (
  <button
    type="button"
    className={`w-full text-left px-4 py-2 hover:bg-zinc-600 cursor-pointer ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};
