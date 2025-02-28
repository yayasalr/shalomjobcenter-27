
import * as React from "react";

// Contexte pour le Sidebar
type SidebarContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  
  return context;
}

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  SidebarProps
>(({ children, className, ...props }, ref) => {
  const { open } = useSidebar();
  
  return (
    <div
      ref={ref}
      className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export const SidebarTrigger = ({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { setOpen } = useSidebar();
  
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
                disabled:pointer-events-none ${className}`}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  );
};

export const SidebarClose = ({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { setOpen } = useSidebar();
  
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
                disabled:pointer-events-none ${className}`}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  );
};

export const SidebarOverlay = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open, setOpen } = useSidebar();
  
  if (!open) {
    return null;
  }
  
  return (
    <div
      className={`fixed inset-0 z-30 bg-black/50 ${className}`}
      onClick={() => setOpen(false)}
      {...props}
    />
  );
};
