/**
 * Type definitions barrel file
 * Exports all types for easy importing
 */

export * from './common';

// Re-export commonly used React types for convenience
export type {
  FC,
  ReactNode,
  ReactElement,
  ComponentProps,
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  FormHTMLAttributes,
  RefObject,
  MutableRefObject,
  CSSProperties,
} from 'react';
