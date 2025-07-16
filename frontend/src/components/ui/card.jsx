import React from "react";

const Card = ({ className = "", ...props }) => (
  <div
    className={`bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex flex-col gap-6 rounded-xl border border-zinc-200 dark:border-zinc-700 py-6 shadow-sm ${className}`}
    {...props}
  />
);

const CardHeader = ({ className = "", ...props }) => (
  <div
    className={`grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pb-6 border-b border-zinc-200 dark:border-zinc-700 ${className}`}
    {...props}
  />
);

const CardTitle = ({ className = "", ...props }) => (
  <div
    className={`leading-none font-semibold text-lg ${className}`}
    {...props}
  />
);

const CardDescription = ({ className = "", ...props }) => (
  <div
    className={`text-gray-500 dark:text-zinc-400 text-sm ${className}`}
    {...props}
  />
);

const CardAction = ({ className = "", ...props }) => (
  <div
    className={`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className}`}
    {...props}
  />
);

const CardContent = ({ className = "", ...props }) => (
  <div className={`px-6 ${className}`} {...props} />
);

const CardFooter = ({ className = "", ...props }) => (
  <div
    className={`flex items-center px-6 pt-6 border-t border-zinc-200 dark:border-zinc-700 ${className}`}
    {...props}
  />
);

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
