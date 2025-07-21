import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  type = "text", 
  className, 
  error,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full px-3 py-2 text-sm bg-white border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed",
        error
          ? "border-red-300 focus:ring-red-500"
          : "border-gray-300 hover:border-gray-400",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;