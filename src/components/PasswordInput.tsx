import Link from "next/link";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface ActionLink {
  label: string;
  href: string;
  onClick?: () => void;
  className?: string;
}

interface PasswordInputProps {
  /** Input-ийн ID (үгүй бол "password" байна) */
  id?: string;
  /** Тогтмол утга */
  value: string;
  /** onChange эвэнт */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Шошго (default: "Нууц үг") */
  label?: string;
  /** Placeholder (default: "••••••••") */
  placeholder?: string;
  /** Алдааны мессеж */
  errorMessage?: string;
  /** Үйлдлийн холбоос (жишээ: нууц үг сэргээх) */
  actionLink?: ActionLink;
  /** autoComplete тохиргоо */
  autoComplete?: string;
  /** Нууц үг харагдах/илүү харагдах товчийг үзүүлэх эсэх (default: true) */
  showToggleVisibility?: boolean;
  /** Контейнер дээр нэмэлт CSS класс */
  className?: string;
  /** Input дээр нэмэлт CSS класс */
  inputClassName?: string;
  /** Label дээр нэмэлт CSS класс */
  labelClassName?: string;
  /** Cypress test */
  dataTestId?: string;
}

export const PasswordInput = ({
  id = "password",
  value,
  onChange,
  label = "Нууц үг",
  placeholder = "••••••••",
  errorMessage,
  actionLink,
  autoComplete,
  showToggleVisibility = true,
  className,
  inputClassName,
  labelClassName,
  dataTestId = "password-input", // ✅ default test ID
}: PasswordInputProps & { dataTestId?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible((prev) => !prev);

  return (
    <div className={className} data-testid={`${dataTestId}-container`}>
      <div className="mb-1 flex items-center justify-between">
        <Label
          htmlFor={id}
          className={`font-semibold ${labelClassName || ""}`}
          data-testid={`${dataTestId}-label`}
        >
          {label}
        </Label>
        {actionLink && (
          <div className="text-sm">
            <Link
              href={actionLink.href}
              onClick={actionLink.onClick}
              className={`cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-500 ${
                actionLink.className || ""
              }`}
              data-testid={`${dataTestId}-action-link`}
            >
              {actionLink.label}
            </Link>
          </div>
        )}
      </div>
      <div className="relative">
        <Input
          id={id}
          placeholder={placeholder}
          className={`border ${
            errorMessage ? "border-red-500" : "border-gray-300"
          } bg-gray-50 pe-10 ${inputClassName || ""}`}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={!!errorMessage}
          aria-describedby={errorMessage ? `${id}-error` : undefined}
          data-testid={`${dataTestId}-input`}
        />
        {showToggleVisibility && (
          <button
            type="button"
            onClick={toggleVisibility}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            aria-controls={id}
            data-testid={`${dataTestId}-toggle`}
            className="text-muted-foreground/80 hover:text-foreground focus-visible:outline-ring/70 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg outline-offset-2 transition-colors focus:z-10 focus-visible:outline focus-visible:outline-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isVisible ? (
              <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Eye size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex items-center gap-2 font-semibold text-red-500"
            role="alert"
            data-testid={`${dataTestId}-error`}
          >
            <AlertCircle size={16} />
            <span className="text-sm">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
