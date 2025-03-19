import * as React from "react";
import { cn } from "@/lib/utils";

// Dialog component updated to handle onOpenChange
const Dialog = React.forwardRef<
  HTMLDivElement,
  { onOpenChange?: (open: boolean) => void } & React.HTMLAttributes<HTMLDivElement>
>(({ className, onOpenChange, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);

  // Update state when dialog is opened or closed
  React.useEffect(() => {
    if (onOpenChange) {
      onOpenChange(open); // Notify parent when open state changes
    }
  }, [open, onOpenChange]);

  const handleClose = () => {
    setOpen(false); // Close dialog when triggered
  };

  return (
    <div
      ref={ref}
      className={cn("fixed inset-0 z-50 flex items-center justify-center", className)}
      {...props}
    >
      {open && (
        <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>
      )}
      <div className="relative bg-white p-6 rounded-lg shadow-lg">{props.children}</div>
    </div>
  );
});
Dialog.displayName = "Dialog";

// DialogHeader, DialogTitle, DialogContent, DialogClose remain the same
const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex justify-between items-center p-4 border-b", className)}
    {...props}
  />
));
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-xl font-semibold", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
));
DialogContent.displayName = "DialogContent";

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("absolute top-2 right-2 p-2", className)}
    {...props}
  />
));
DialogClose.displayName = "DialogClose";

export { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose };
