import React from "react";

const Label = ({ className = "", ...props }) => (
  <label
    className={`flex items-center gap-2 text-sm leading-none font-medium select-none text-zinc-200 ${className}`}
    {...props}
  />
);

export { Label };
