/**
 * Modal component with modern TypeScript patterns and accessibility features
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { type VariantProps, cva } from 'class-variance-authority';

import { useEscapeKey } from '../../lib/hooks';
import { cn } from '../../lib/utils';
import type { FC, ReactNode } from 'react';

// Modal variants
const modalVariants = cva(
  'fixed inset-0 z-50 flex items-center justify-center p-4',
  {
    variants: {
      overlay: {
        default: 'bg-black/50',
        blur: 'bg-black/50 backdrop-blur-sm',
        dark: 'bg-black/70',
      },
      position: {
        center: 'items-center justify-center',
        top: 'items-start justify-center pt-20',
        bottom: 'items-end justify-center pb-20',
      },
    },
    defaultVariants: {
      overlay: 'default',
      position: 'center',
    },
  }
);

const modalContentVariants = cva(
  'relative w-full max-w-lg mx-auto bg-background border border-border rounded-lg shadow-lg',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw] max-h-[95vh]',
      },
      animation: {
        scale: 'animate-in zoom-in-95 duration-300',
        slide: 'animate-in slide-in-from-bottom-4 duration-300',
        fade: 'animate-in fade-in duration-300',
      },
    },
    defaultVariants: {
      size: 'md',
      animation: 'scale',
    },
  }
);

export interface ModalProps extends VariantProps<typeof modalVariants>, VariantProps<typeof modalContentVariants> {
  /**
   * Whether the modal is open
   */
  open: boolean;
  /**
   * Callback to close the modal
   */
  onClose: () => void;
  /**
   * Modal content
   */
  children: ReactNode;
  /**
   * Modal title
   */
  title?: ReactNode;
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  /**
   * Whether clicking the overlay closes the modal
   */
  closeOnOverlayClick?: boolean;
  /**
   * Whether pressing escape closes the modal
   */
  closeOnEscape?: boolean;
  /**
   * Custom className for the modal content
   */
  className?: string;
  /**
   * Custom className for the overlay
   */
  overlayClassName?: string;
  /**
   * Portal container (defaults to document.body)
   */
  container?: Element;
}

/**
 * Modal component with portal rendering and accessibility features
 * 
 * @example
 * ```tsx
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 *   size="md"
 * >
 *   <p>Are you sure you want to continue?</p>
 * </Modal>
 * ```
 */
export const Modal: FC<ModalProps> = ({
  open,
  onClose,
  children,
  title,
  showCloseButton = true,
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

  // Handle body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  // Handle overlay click
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
        className={cn(modalContentVariants({ size, animation }), className)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-foreground"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-4 h-4"
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

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, container || document.body);
};

/**
 * Modal header component
 */
export const ModalHeader: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}>
    {children}
  </div>
);

/**
 * Modal title component
 */
export const ModalTitle: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
    {children}
  </h3>
);

/**
 * Modal description component
 */
export const ModalDescription: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <p className={cn('text-sm text-muted-foreground', className)}>
    {children}
  </p>
);

/**
 * Modal footer component
 */
export const ModalFooter: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}>
    {children}
  </div>
);
