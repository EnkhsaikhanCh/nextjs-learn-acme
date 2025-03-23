import { AnimatePresence, motion } from "framer-motion";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ReactNode, useEffect, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";

interface BaseInputProp {
  label: string;
  id?: string;
  value: string; // Controlled компонент тул заавал байх ёстой
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; // Зөвхөн string эсвэл undefined
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  labelExtra?: ReactNode;
  description?: string;
  tabIndex?: number;
  className?: string; // Контейнерын стиль
  inputClassName?: string; // Input-ийн стиль
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
}: BaseInputProp) => {
  const inputId = id || `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasFocused, setHasFocused] = useState(false); // Фокус хийгдсэн эсэхийг хянах

  // Анхны алдаанд фокус хийх логик
  useEffect(() => {
    if (error && !hasFocused && inputRef.current) {
      inputRef.current.focus();
      setHasFocused(true); // Дараа нь дахин фокус хийхгүй
    }
  }, [error, hasFocused]);

  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const ariaDescribedBy = [descriptionId, errorId].filter(Boolean).join(" ");

  return (
    <div className={`grid gap-2 ${className || ""}`}>
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
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy || undefined}
        className={`border bg-gray-50 ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName || ""}`}
      />

      {description && (
        <p
          id={descriptionId}
          className={`-mt-1 text-xs text-gray-500 ${error ? "text-red-500" : ""}`}
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
          >
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
