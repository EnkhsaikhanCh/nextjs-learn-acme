import { AnimatePresence, motion } from "framer-motion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ReactNode, useEffect, useRef } from "react";

interface BaseInputProp {
  label: string;
  id?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | { [key: string]: string };
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
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const inputRef = useRef<HTMLInputElement>(null);

  const errorMessage =
    typeof error === "string" ? error : error?.[inputId || label];

  useEffect(() => {
    if (errorMessage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [errorMessage]);

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
        tabIndex={tabIndex}
        ref={inputRef}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? `${inputId}-error` : undefined}
        className={`border bg-gray-50 ${
          errorMessage ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />

      {description && (
        <p
          className={`-mt-1 text-xs text-gray-500 ${errorMessage ? "text-red-500" : ""}`}
        >
          {description}
        </p>
      )}

      <AnimatePresence>
        {errorMessage && (
          <motion.span
            id={`${inputId}-error`}
            className="-mt-1 rounded-sm bg-red-100 px-2 py-1 text-sm font-semibold text-red-500"
            role="alert"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {errorMessage}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
