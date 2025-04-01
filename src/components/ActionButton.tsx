import Link from "next/link";
import { Button } from "./ui/button";

interface ActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?:
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"
    | "default"
    | null
    | undefined;
  type?: "submit" | "reset" | "button" | undefined;
  dataTestId?: string; // ✅ нэмэгдсэн
}

export const ActionButton = ({
  label,
  icon,
  className,
  href,
  onClick,
  disabled,
  variant,
  type,
  dataTestId = "action-button", // default test ID
}: ActionButtonProps) => {
  const content = (
    <>
      {label}
      {icon && (
        <span data-testid={`${dataTestId}-icon`} aria-hidden="true">
          {icon}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href}>
        <Button
          className={className}
          disabled={disabled}
          role="button"
          aria-label={label}
          data-testid={dataTestId}
        >
          {content}
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-label={label}
      data-testid={dataTestId}
    >
      {content}
    </Button>
  );
};
