import { Input } from "./ui/input";
import { Label } from "./ui/label";

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
}: BaseInputProp) => {
  const inputId =
    id || `base-input-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="grid gap-2">
      {/* Input label */}
      <Label htmlFor={inputId} className="text-gray-600">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Input field */}
      <Input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />

      {/* Error message */}
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
