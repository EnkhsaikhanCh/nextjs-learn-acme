import { AnimatePresence, motion } from "framer-motion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ReactNode, useEffect, useRef } from "react";

interface BaseInputProp {
  label: string;
  id?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  labelExtra?: ReactNode;
  description?: string;
  tabIndex?: number;
}

export const BaseInput = ({
  label,
  id,
  error,
  value,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
  onChange,
  labelExtra,
  description,
  tabIndex,
}: BaseInputProp) => {
  const inputId =
    id || `base-input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus and blur management for errors
  useEffect(() => {
    if (error && inputRef.current) {
      inputRef.current.focus();
    } else if (!error && inputRef.current) {
      inputRef.current.blur();
    }
  }, [error]);

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={inputId} className="font-semibold">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {labelExtra && <div className="text-sm">{labelExtra}</div>}
      </div>

      <Input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-required={required}
        tabIndex={tabIndex}
        aria-invalid={!!error}
        ref={inputRef}
        className={`border bg-gray-50 ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />

      {description && (
        <p
          id={`${inputId}-description`}
          className={`-mt-1 text-xs text-gray-500 ${error ? "text-red-500" : ""}`}
        >
          {description}
        </p>
      )}

      <AnimatePresence>
        {error && (
          <motion.span
            id={`${inputId}-error`}
            className="-mt-1 rounded-sm bg-red-100 px-2 py-1 text-sm font-semibold text-red-500"
            role="alert"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
