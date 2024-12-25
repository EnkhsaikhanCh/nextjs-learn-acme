import { Button } from "./ui/button";

interface ActionButtonProps {
  label: string;
}

export const ActionButton = ({ label }: ActionButtonProps) => {
  return <Button>{label}</Button>;
};
