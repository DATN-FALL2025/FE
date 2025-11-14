import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ 
  message = "Đang tải dữ liệu...", 
  size = "md",
  className = ""
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  return (
    <div className={`flex items-center justify-center h-[60vh] ${className}`}>
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin mx-auto text-primary mb-4`} />
        {message && <p className="text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}

// Inline loading spinner for buttons
export function InlineLoadingSpinner({ message = "Đang xử lý..." }: { message?: string }) {
  return (
    <>
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      {message}
    </>
  );
}

