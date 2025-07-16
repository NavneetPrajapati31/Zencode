import React, { useState } from "react";

const Tabs = ({ defaultValue, className = "", children, ...props }) => {
  const [value, setValue] = useState(defaultValue);
  // Provide context via props drilling
  return (
    <div className={`flex flex-col gap-2 ${className}`} {...props}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { value, setValue })
          : child
      )}
    </div>
  );
};

const TabsList = ({ className = "", children, value, setValue, ...props }) => (
  <div
    className={`inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] bg-zinc-700 text-zinc-300 ${className}`}
    {...props}
  >
    {React.Children.map(children, (child) =>
      React.isValidElement(child)
        ? React.cloneElement(child, { value, setValue })
        : child
    )}
  </div>
);

const TabsTrigger = ({
  value: triggerValue,
  setValue,
  value,
  className = "",
  children,
  ...props
}) => (
  <button
    type="button"
    className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors data-[state=active]:bg-zinc-600 data-[state=active]:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400 ${value === triggerValue ? "bg-zinc-600 text-zinc-100" : "text-zinc-300"} ${className}`}
    data-state={value === triggerValue ? "active" : undefined}
    onClick={() => setValue && setValue(triggerValue)}
    {...props}
  >
    {children}
  </button>
);

const TabsContent = ({
  value: contentValue,
  value,
  className = "",
  children,
  ...props
}) => {
  if (value !== contentValue) return null;
  return (
    <div className={`flex-1 outline-none ${className}`} {...props}>
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
