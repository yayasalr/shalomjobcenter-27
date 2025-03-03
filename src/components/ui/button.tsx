
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 border border-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-destructive",
        outline:
          "border border-input bg-background hover:bg-accent/10 hover:text-accent-foreground hover:border-black",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-secondary",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        airbnb: "bg-airbnb-red text-white hover:bg-airbnb-red/90 hover:-translate-y-[2px] border border-airbnb-red",
        primary: "bg-sholom-primary text-white hover:bg-sholom-primary-dark hover:-translate-y-[2px] border border-sholom-primary",
        accent: "bg-sholom-accent text-white hover:bg-sholom-accent/90 hover:-translate-y-[2px] border border-sholom-accent",
        modern: "bg-white border border-gray-200 text-gray-800 hover:border-gray-900 hover:shadow-lg hover:-translate-y-[2px]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-8 text-base",
        xl: "h-14 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
        wide: "h-10 px-6 py-2 w-full",
        pill: "h-10 px-6 py-2 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
