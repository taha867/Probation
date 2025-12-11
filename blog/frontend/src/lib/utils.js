import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

//clsx  → removes false/undefined/duplicate classes  
//twMerge → merges conflicting Tailwind classes


export function cn(...inputs) {
  return twMerge(clsx(inputs))
}