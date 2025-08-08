import React, { Fragment, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useThemeStore } from '../store/themeStore';

interface CustomModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  children: React.ReactNode;
  padding?: string;
  closeButton?: boolean;
  title?: React.ReactNode;
  animation?: 'slideUp' | 'fadeIn';
  className?: string;
  overlayClass?: string;
  overlayClose?: boolean;
  rounded?: string;
  draggableModal?: boolean;
  isConnectWallet?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  show,
  setShow,
  children,
  padding = 'p-[10px] md:p-[30px] py-[20px]',
  closeButton,
  title,
  animation = 'slideUp',
  className,
  overlayClass = 'items-end md:items-center',
  overlayClose = true,
  rounded = 'rounded-b-0 rounded-t-[10px] md:rounded-[10px]',
  draggableModal = false,
  isConnectWallet = false,
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const initialY = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!draggableModal) return;
    setIsDragging(true);
    initialY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaY = e.clientY - initialY.current;
    initialY.current = e.clientY;
    const modal = modalRef.current;
    if (!modal) return;
    
    const newTop = modal.offsetTop + deltaY;
    if (draggableModal) {
      if (newTop > 0) {
        modal.style.top = `${newTop}px`;
      }
      if (newTop > 100) {
        setShow(false);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (overlayClose && e.target === e.currentTarget) {
      setShow(false);
    }
  };

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, setShow]);

  if (!show) return null;

  return (
    <Fragment>
      <div
        className={clsx(
          'fixed inset-0 bg-black bg-opacity-75 z-[999] flex items-center justify-center',
          overlayClass
        )}
        onClick={handleOverlayClick}
      >
        <div
          className={clsx(
            'w-full flex justify-center md:w-auto relative',
            animation === 'slideUp' && show && 'animate-slide-up',
            animation === 'fadeIn' && show && 'animate-fade-in'
          )}
          onClick={(event) => event.stopPropagation()}
        >
          <div
            className={clsx(
              'w-full md:min-w-[450px] mx-0 wallet-modal',
              className
            )}
          >
            <div
              className={clsx(
                isConnectWallet && 'flex flex-col',
                'relative z-[99999]',
                isDark ? 'bg-[#071B2F]' : 'bg-white',
                padding,
                rounded,
                isDragging && 'absolute'
              )}
              ref={modalRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {title && (
                <div className="flex items-center justify-between mb-2.5">
                  <h3
                    className={clsx(
                      isDark ? 'text-[#F5F8FA]' : 'text-[#3F4254]',
                      'text-[20px] w-full md:text-[24px] font-semibold'
                    )}
                  >
                    {title}
                  </h3>
                  {closeButton && (
                    <button onClick={() => setShow(false)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="24"
                        viewBox="0 0 25 24"
                        fill="none"
                      >
                        <path
                          d="M6.81055 17.243L12.0535 12L17.2965 17.243M17.2965 6.75696L12.0525 12L6.81055 6.75696"
                          className="stroke-icon"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CustomModal;
