/**
 * Modal component with extended positions (center, top, bottom, left, right)
 * and correct animations.
 */

import React, { useEffect, type FC, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { type VariantProps, cva } from 'class-variance-authority';

import { useEscapeKey } from '../../lib/hooks';
import { cn } from '../../lib/utils';

// Overlay container variants
const modalVariants = cva(
  'fixed inset-0 z-[9999] flex',
  {
    variants: {
      overlay: {
        default: 'bg-black/70',
        blur: 'bg-black/70 backdrop-blur-sm',
        dark: 'bg-black/70',
      },
      position: {
        center: 'items-center justify-center',
        top: 'items-start justify-center',
        bottom: 'items-end justify-center',
        left: 'items-center justify-start',
        right: 'items-center justify-end',
      },
    },
    defaultVariants: {
      overlay: 'default',
      position: 'center',
    },
  }
);

// Modal content variants
const modalContentVariants = cva(
  'relative bg-[#071B2F] border-0 shadow-lg',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'w-full h-full',
        fullWidth: 'w-full',
        fullHeight: 'h-full',
      },
      position: {
        center: 'rounded-[10px] m-4',
        top: 'rounded-b-[10px] w-full',
        bottom: 'rounded-t-[10px] w-full',
        left: 'rounded-r-[10px] h-full',
        right: 'rounded-l-[10px] h-full',
      },
      animation: {
        scale: 'animate-in zoom-in-95 duration-300',
        fade: 'animate-in fade-in duration-300',
        slide: '', // handled by compound variants
      },
    },
    compoundVariants: [
      { animation: 'slide', position: 'bottom', class: 'animate-in slide-in-from-bottom-4 duration-300' },
      { animation: 'slide', position: 'top', class: 'animate-in slide-in-from-top-4 duration-300' },
      { animation: 'slide', position: 'left', class: 'animate-in slide-in-from-left-4 duration-300' },
      { animation: 'slide', position: 'right', class: 'animate-in slide-in-from-right-4 duration-300' },
    ],
    defaultVariants: {
      size: 'md',
      position: 'center',
      animation: 'scale',
    },
  }
);

export interface ModalProps
  extends VariantProps<typeof modalVariants>,
  VariantProps<typeof modalContentVariants> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  showCloseButton?: boolean;
  showSeparator?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  container?: Element;
}

/**
 * Modal component with extended positioning and animations
 */
export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  children,
  title,
  showCloseButton = true,
  showSeparator = false,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  overlay,
  position,
  size,
  animation,
  className,
  overlayClassName,
  container,
}) => {
  // Handle escape key
  useEscapeKey(onClose, closeOnEscape && open);

  // Body scroll lock
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Overlay click handler
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!open) return null;

  const modalContent = (
    <div
      className={cn(modalVariants({ overlay, position }), overlayClassName)}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={cn(modalContentVariants({ size, position, animation }), className)}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-6">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-[#F5F8FA]">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#1B456F]/20 rounded-[20px] transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-4 h-4 text-[#F5F8FA]"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {showSeparator && <div className="mx-6 h-px bg-[#A1A5B7]" />}

        <div className="mx-6 mb-6 border border-[#1B456F] rounded-[7px] p-4 bg-transparent">
          <div className="text-[#F5F8FA]">{children}</div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, container || document.body);
};

// Subcomponents
export const ModalHeader: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}>{children}</div>;

export const ModalTitle: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => <h3 className={cn('text-lg font-semibold leading-none tracking-tight text-[#F5F8FA]', className)}>{children}</h3>;

export const ModalDescription: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => <p className={cn('text-sm text-[#A1A5B7]', className)}>{children}</p>;

export const ModalFooter: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}>{children}</div>;
