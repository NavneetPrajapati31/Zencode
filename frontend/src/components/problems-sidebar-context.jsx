import { createContext, useContext, useState } from "react";

// Context for Problems Sidebar open/close state, now used for custom animated sidebar
const SidebarContext = createContext();

export const useProblemsSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "useProblemsSidebar must be used within a ProblemsSidebarProvider"
    );
  }
  return context;
};

export function ProblemsSidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <SidebarContext.Provider
      value={{ isOpen, toggleSidebar, closeSidebar }}
      className="theme-transition"
    >
      {children}
    </SidebarContext.Provider>
  );
}
