// _components/ResendSection.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "lucide-react";

interface ResendSectionProps {
  resendTimer: number;
  onResend: () => void;
  isResending: boolean;
}

export const ResendSection: React.FC<ResendSectionProps> = ({
  resendTimer,
  onResend,
  isResending,
}) => (
  <Card className="mt-4 text-center shadow-none">
    <CardHeader className="py-4 pb-0 pt-4">
      <CardTitle className="text-md font-semibold text-foreground/80">
        Баталгаажуулах код хүлээн аваагүй байна уу?
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 pb-4">
      <Button
        variant="link"
        type="button"
        size={"sm"}
        className={`text-blue-600 transition-opacity hover:underline ${
          isResending || resendTimer > 0 ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={onResend}
        disabled={isResending || resendTimer > 0}
      >
        {isResending ? (
          <>
            Код дахин илгээж байна...
            <Loader className="h-4 w-4 animate-spin" />
          </>
        ) : resendTimer > 0 ? (
          <>Кодыг дахин илгээх ({resendTimer} сек)</>
        ) : (
          <>Кодыг дахин илгээх</>
        )}
      </Button>
    </CardContent>
  </Card>
);
