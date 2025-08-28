import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function isValidFileType(fileName: string): boolean {
  const allowedExtensions = /\.(pdf|jpeg|jpg|png)$/i
  return allowedExtensions.test(fileName)
}
