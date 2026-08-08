import clsx, { type ClassValue } from "clsx";

/** Tiny classname helper. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
