import Link from "next/link";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  resetPassword?: boolean;
  autoComplete?: string;
}

export const PasswordInput = ({
  value,
  onChange,
  errorMessage,
  resetPassword,
  autoComplete,
}: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Label htmlFor="password" className="font-semibold">
          Нууц үг
        </Label>

        {resetPassword && (
          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-500"
            >
              Нууц үг сэргээх үү?
            </Link>
          </div>
        )}
      </div>
      <div className="relative">
        <Input
          id="password"
          placeholder="••••••••"
          className={`border ${errorMessage ? "border-red-500" : "border-gray-300"} bg-gray-50 pe-10`}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={errorMessage ? "true" : "false"}
          aria-describedby={errorMessage ? "password-error" : undefined}
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          {isVisible ? (
            <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            className="mt-1 w-full rounded-sm bg-red-100 px-2 py-1 text-sm font-semibold text-red-500"
            role="alert"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
