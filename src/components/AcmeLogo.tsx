import { Globe } from "lucide-react";

export function AcmeLogo() {
  return (
    <div className="flex flex-row items-center leading-none text-white">
      <Globe className="h-12 w-12" data-testid="logo-icon" />
      <p className="text-[44px]">Acme</p>
    </div>
  );
}
