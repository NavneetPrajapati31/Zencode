import React from "react";

const Switch = ({ checked, onChange, className = "", ...props }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onChange && onChange(!checked)}
    className={`inline-flex h-[1.15rem] w-8 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus:ring-2 focus:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-blue-600" : "bg-zinc-700"} ${className}`}
    {...props}
  >
    <span
      className={`block size-4 rounded-full transition-transform bg-white ${checked ? "translate-x-4" : "translate-x-0"}`}
    />
  </button>
);

export { Switch };
