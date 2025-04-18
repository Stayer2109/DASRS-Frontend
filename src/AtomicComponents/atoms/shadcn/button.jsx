/* eslint-disable react-refresh/only-export-components */
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"
import PropTypes from "prop-types";
import { Tooltip } from "react-tooltip";

const buttonVariants = cva(
  "inline-flex justify-center items-center gap-2 disabled:opacity-50 aria-invalid:border-destructive focus-visible:border-ring rounded-md outline-none aria-invalid:ring-destructive/20 focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 font-medium text-sm whitespace-nowrap transition-all [&_svg]:pointer-events-none disabled:pointer-events-none shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  disabled,
  size,
  asChild = false,
  tooltipData = "",
  toolTipPos = "top",
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <div
      data-tooltip-id={tooltipData ? "my-tooltip" : undefined}
      data-tooltip-content={tooltipData || undefined}
      data-tooltip-place={toolTipPos}
      className={cn(
        "inline-block",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <Comp
        disabled={disabled}
        className={cn(
          buttonVariants({ variant, size, className }),
          disabled && "pointer-events-none"
        )}
        {...props}
      />
    </div>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf([
    "default",
    "destructive",
    "outline",
    "secondary",
    "ghost",
    "link",
  ]),
  size: PropTypes.oneOf(["default", "sm", "lg", "icon"]),
  asChild: PropTypes.bool,
  tooltipData: PropTypes.string,
  toolTipPos: PropTypes.string,
  disabled: PropTypes.bool,
}

export { Button, buttonVariants }
