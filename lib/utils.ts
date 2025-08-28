import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function isValidFileType (file: File): boolean {
  const fileType = file.type;
  const isValidFileTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!isValidFileTypes.includes(fileType)) {
    return false;
  }
  return true;
}