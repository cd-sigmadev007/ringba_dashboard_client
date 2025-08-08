/**
 * Class name utility using clsx and tailwind-merge for optimal Tailwind CSS class handling
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names and merges Tailwind CSS classes intelligently
 * @param inputs - Class names to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Creates a class name utility with predefined base classes
 * @param baseClasses - Base classes to always include
 * @returns Function that merges base classes with additional classes
 */
export function createCn(baseClasses: string) {
  return (...inputs: ClassValue[]) => cn(baseClasses, ...inputs);
}

/**
 * Conditional class name helper
 * @param condition - Boolean condition
 * @param trueClasses - Classes to apply when condition is true
 * @param falseClasses - Classes to apply when condition is false
 * @returns Class string based on condition
 */
export function conditionalCn(
  condition: boolean,
  trueClasses: string,
  falseClasses?: string
): string {
  return condition ? trueClasses : falseClasses || '';
}
