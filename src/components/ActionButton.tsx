import Link from "next/link";
import { Button } from "./ui/button";

interface ActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const ActionButton = ({
  label,
  icon,
  className,
  href,
  onClick,
  disabled,
}: ActionButtonProps) => {
  const content = (
    <>
      {label}
      {icon && <span data-testid="button-icon">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href}>
        <Button className={className} disabled={disabled}>
          {content}
        </Button>
      </Link>
    );
  }

  return (
    <Button className={className} onClick={onClick} disabled={disabled}>
      {content}
    </Button>
  );
};
