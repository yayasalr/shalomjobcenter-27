
"use client";

import * as React from "react";
import { cva } from "class-variance-authority";

const sidebarVariants = cva(
  "h-screen overflow-auto fixed left-0 top-0 z-50 bg-background shadow-lg transition-transform duration-300 ease-in-out",
  {
    variants: {
      expanded: {
        true: "translate-x-0",
        false: "-translate-x-full lg:translate-x-0",
      },
    },
    defaultVariants: {
      expanded: true,
    },
  }
);

// Create the sidebar context with expanded state
interface SidebarContext {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  toggle: () => void;
}

const SidebarContext = React.createContext<SidebarContext>({
  expanded: true,
  setExpanded: () => {},
  toggle: () => {},
});

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = React.useState(true);

  const toggle = React.useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { expanded } = useSidebar();

  return (
    <div className={sidebarVariants({ expanded })}>
      <div className="min-h-screen w-64 border-r">{children}</div>
    </div>
  );
}

export function SidebarTrigger() {
  const { toggle } = useSidebar();

  return (
    <button
      className="fixed bottom-4 left-4 z-50 lg:hidden rounded-full bg-primary p-2 text-white shadow-lg"
      onClick={toggle}
    >
      <MenuIcon className="h-6 w-6" />
    </button>
  );
}

function MenuIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

export function SidebarHeader({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex h-14 items-center border-b px-4">
      {children || <div className="font-semibold">SHALOM JOB CENTER</div>}
    </div>
  );
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}</div>;
}

export function SidebarFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-auto p-4 border-t">{children}</div>;
}

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="pb-4">{children}</div>;
}

export function SidebarGroupLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">
      {children}
    </div>
  );
}

export function SidebarGroupContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-1">{children}</div>;
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <nav className="space-y-1">{children}</nav>;
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

export function SidebarMenuButton({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground">
      {children}
    </Comp>
  );
}

function Slot({ className, ...props }: React.ComponentProps<"div">) {
  const child = React.Children.only(props.children) as React.ReactElement;
  return React.cloneElement(child, {
    className: `${child.props.className || ""} ${className || ""}`.trim(),
  });
}
