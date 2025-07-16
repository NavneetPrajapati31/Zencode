import React from "react";

const Separator = ({
  orientation = "horizontal",
  className = "",
  ...props
}) => {
  if (orientation === "vertical") {
    return (
      <div className={`w-px h-full bg-zinc-700 ${className}`} {...props} />
    );
  }
  return (
    <hr
      className={`h-px w-full bg-zinc-700 border-0 ${className}`}
      {...props}
    />
  );
};

export { Separator };
