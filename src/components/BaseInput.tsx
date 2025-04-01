import { AnimatePresence, motion } from "framer-motion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ReactNode, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";

interface BaseInputProp {
  label: string;
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  labelExtra?: ReactNode;
  description?: string;
  tabIndex?: number;
  className?: string;
  inputClassName?: string;
  dataTestId?: string; // ✅ шинээр нэмэгдсэн prop
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
  className,
  inputClassName,
  dataTestId = "base-input", // ✅ default test ID
}: BaseInputProp) => {
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasFocused, setHasFocused] = useState(false);

  useEffect(() => {
    if (error && !hasFocused && inputRef.current) {
      inputRef.current.focus();
      setHasFocused(true);
    }
  }, [error, hasFocused]);

  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const ariaDescribedBy = [descriptionId, errorId].filter(Boolean).join(" ");

  return (
    <div
      className={`grid gap-2 ${className || ""}`}
      data-testid={`${dataTestId}-container`}
    >
      <div className="flex items-center justify-between">
        <Label
          htmlFor={inputId}
          className="font-semibold"
          data-testid={`${dataTestId}-label`}
        >
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
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy || undefined}
        className={`border bg-gray-50 ${
          error ? "border-red-500" : "border-gray-300"
        } focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${inputClassName || ""}`}
        data-testid={`${dataTestId}-input`}
      />

      {description && (
        <p
          id={descriptionId}
          className={`-mt-1 text-xs text-gray-500 ${error ? "text-red-500" : ""}`}
          data-testid={`${dataTestId}-description`}
        >
          {description}
        </p>
      )}

      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            id={errorId}
            className="flex items-center gap-2 font-semibold text-red-500"
            role="alert"
            data-testid={`${dataTestId}-error`}
          >
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
