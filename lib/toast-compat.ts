/**
 * Toast Compatibility Layer
 * Wrapper để convert toast format cũ (shadcn) sang format mới (sonner)
 * Sử dụng tạm thời trong quá trình migration
 */

import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function toast(options: ToastOptions) {
  const { title, description, variant, duration = 4000 } = options;
  
  const message = title || description || "Notification";
  const desc = title && description ? description : undefined;
  
  if (variant === "destructive") {
    sonnerToast.error(message, {
      description: desc,
      duration,
    });
  } else {
    sonnerToast.success(message, {
      description: desc,
      duration,
    });
  }
}

// Export sonner toast methods for new code
export const toastSuccess = sonnerToast.success;
export const toastError = sonnerToast.error;
export const toastInfo = sonnerToast.info;
export const toastWarning = sonnerToast.warning;
export const toastLoading = sonnerToast.loading;
export const toastDismiss = sonnerToast.dismiss;
