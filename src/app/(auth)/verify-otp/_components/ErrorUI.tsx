import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { MailCheck } from "lucide-react";

export function ErrorUI() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="min-w-full max-w-md sm:w-[460px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-teal-500 bg-teal-200">
              <MailCheck className="h-6 w-6 stroke-[2.5] text-teal-600" />
              <span className="sr-only">Sing up</span>
            </div>
            <p>Имэйл баталгаажуулалт</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border-2 border-dashed border-yellow-500 bg-yellow-200 px-3 py-2 text-center font-semibold text-yellow-600">
            <p>И-мэйл хаяг оруулаагүй байна. Дахин оролдоно уу.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
