import {
  Children,
  type HTMLAttributes,
  type SVGProps,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export type CursorProps = HTMLAttributes<HTMLSpanElement>;

export const Cursor = ({ className, children, ...props }: CursorProps) => (
  <span className={className} {...props}>
    {children}
  </span>
);

export type CursorPointerProps = SVGProps<SVGSVGElement>;

export const CursorPointer = ({ className, ...props }: CursorPointerProps) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const hide = () => setVisible(false);
    const show = () => setVisible(true);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", hide);
    window.addEventListener("mouseup", show);
    window.addEventListener("pointerdown", hide);
    window.addEventListener("pointerup", show);
    window.addEventListener("dragstart", hide);
    window.addEventListener("dragend", show);
    window.addEventListener("selectstart", hide);
    window.addEventListener("selectionchange", () => {
      const sel = window.getSelection();
      setVisible(!sel || sel.isCollapsed);
    });
    // Hide on hover/focus of interactive elements and .cursor-pointer
    const interactiveSelectors =
      'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"]), .cursor-pointer';
    const hideOnHover = () => setVisible(false);
    const showOnLeave = () => setVisible(true);
    const interactiveEls = Array.from(
      document.querySelectorAll(interactiveSelectors)
    );
    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", hideOnHover);
      el.addEventListener("mouseleave", showOnLeave);
      el.addEventListener("focusin", hideOnHover);
      el.addEventListener("focusout", showOnLeave);
    });
    document.body.style.cursor = "none";
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", hide);
      window.removeEventListener("mouseup", show);
      window.removeEventListener("pointerdown", hide);
      window.removeEventListener("pointerup", show);
      window.removeEventListener("dragstart", hide);
      window.removeEventListener("dragend", show);
      window.removeEventListener("selectstart", hide);
      window.removeEventListener("selectionchange", () => {});
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", hideOnHover);
        el.removeEventListener("mouseleave", showOnLeave);
        el.removeEventListener("focusin", hideOnHover);
        el.removeEventListener("focusout", showOnLeave);
      });
      document.body.style.cursor = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <svg
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%, -50%)",
      }}
      className={cn("size-4", className)}
      fill="none"
      focusable="false"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.438 6.716 1.115.05A.832.832 0 0 0 .05 1.116L6.712 19.45a.834.834 0 0 0 1.557.025l3.198-8 7.995-3.2a.833.833 0 0 0 0-1.559h-.024Z"
        fill="currentColor"
      />
    </svg>
  );
};

export type CursorBodyProps = HTMLAttributes<HTMLSpanElement>;

export const CursorBody = ({
  children,
  className,
  ...props
}: CursorBodyProps) => (
  <span
    className={cn(
      "relative ml-3.5 flex flex-col whitespace-nowrap rounded-xl py-1 pr-3 pl-2.5 text-xs",
      Children.count(children) > 1 && "rounded-tl [&>:first-child]:opacity-70",
      "bg-secondary text-foreground",
      className
    )}
    {...props}
  >
    {children}
  </span>
);

export type CursorNameProps = HTMLAttributes<HTMLSpanElement>;

export const CursorName = (props: CursorNameProps) => <span {...props} />;

export type CursorMessageProps = HTMLAttributes<HTMLSpanElement>;

export const CursorMessage = (props: CursorMessageProps) => <span {...props} />;
