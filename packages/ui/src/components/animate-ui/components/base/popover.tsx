
import {
  Popover as PopoverPrimitive,
  PopoverTrigger as PopoverTriggerPrimitive,
  PopoverPositioner as PopoverPositionerPrimitive,
  PopoverPopup as PopoverPopupPrimitive,
  PopoverPortal as PopoverPortalPrimitive,
  PopoverClose as PopoverClosePrimitive,
  PopoverBackdrop as PopoverBackdropPrimitive,
  PopoverTitle as PopoverTitlePrimitive,
  PopoverDescription as PopoverDescriptionPrimitive,
  type PopoverProps as PopoverPrimitiveProps,
  type PopoverTriggerProps as PopoverTriggerPrimitiveProps,
  type PopoverPositionerProps as PopoverPositionerPrimitiveProps,
  type PopoverPopupProps as PopoverPopupPrimitiveProps,
  type PopoverCloseProps as PopoverClosePrimitiveProps,
  type PopoverBackdropProps as PopoverBackdropPrimitiveProps,
  type PopoverTitleProps as PopoverTitlePrimitiveProps,
  type PopoverDescriptionProps as PopoverDescriptionPrimitiveProps,
} from '@workspace/ui/components/animate-ui/primitives/base/popover';
import { cn } from '@workspace/ui/lib/utils'
import { glass } from "@workspace/ui/lib/glass";

type PopoverProps = PopoverPrimitiveProps;

function Popover(props: PopoverProps) {
  return <PopoverPrimitive {...props} />;
}

type PopoverTriggerProps = PopoverTriggerPrimitiveProps;

function PopoverTrigger(props: PopoverTriggerProps) {
  return <PopoverTriggerPrimitive {...props} />;
}

type PopoverPanelProps = PopoverPositionerPrimitiveProps &
  PopoverPopupPrimitiveProps & {
    /**
     * Fade the panel with its scale (the default). Turn it off for a surface whose
     * backdrop filter has to see the page from the first frame: anything under full
     * opacity is a backdrop root, so refraction glass would only appear once the fade ended.
     */
    fade?: boolean;
  };

function PopoverPanel({
  className,
  align = 'center',
  sideOffset = 4,
  initialFocus,
  finalFocus,
  fade = true,
  style,
  children,
  ...props
}: PopoverPanelProps) {
  return (
    <PopoverPortalPrimitive>
      <PopoverPositionerPrimitive
        align={align}
        sideOffset={sideOffset}
        className="z-50"
        {...props}
      >
        <PopoverPopupPrimitive
          initialFocus={initialFocus}
          finalFocus={finalFocus}
          {...(fade
            ? {}
            : {
                initial: { scale: 0.5 },
                animate: { scale: 1 },
                // Base UI keeps the panel on screen only while it sees a CSS/WAAPI animation, and a
                // scale spring is neither, so the exit carries a fade that waits for the scale to
                // be well under way: the glass keeps its backdrop for the first part of the exit.
                exit: { scale: 0.5, opacity: 0, transition: { opacity: { delay: 0.1, duration: 0.12 } } },
              })}
          className={cn(
            `${glass("overlay")} text-popover-foreground w-72 rounded-md border p-4 shadow-md outline-hidden origin-(--transform-origin)`,
            className,
          )}
          style={style}
        >
          {children}
        </PopoverPopupPrimitive>
      </PopoverPositionerPrimitive>
    </PopoverPortalPrimitive>
  );
}

type PopoverCloseProps = PopoverClosePrimitiveProps;

function PopoverClose(props: PopoverCloseProps) {
  return <PopoverClosePrimitive {...props} />;
}

type PopoverBackdropProps = PopoverBackdropPrimitiveProps;

function PopoverBackdrop(props: PopoverBackdropProps) {
  return <PopoverBackdropPrimitive {...props} />;
}

type PopoverTitleProps = PopoverTitlePrimitiveProps;

function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <PopoverTitlePrimitive
      className={cn('text-sm leading-5 font-medium', className)}
      {...props}
    />
  );
}

type PopoverDescriptionProps = PopoverDescriptionPrimitiveProps;

function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <PopoverDescriptionPrimitive
      className={cn('text-sm text-foreground', className)}
      {...props}
    />
  );
}

export {
  Popover,
  PopoverTrigger,
  PopoverPanel,
  PopoverClose,
  PopoverBackdrop,
  PopoverTitle,
  PopoverDescription,
  type PopoverProps,
  type PopoverTriggerProps,
  type PopoverPanelProps,
  type PopoverCloseProps,
  type PopoverBackdropProps,
  type PopoverTitleProps,
  type PopoverDescriptionProps,
};
