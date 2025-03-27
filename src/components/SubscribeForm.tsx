"use client";

import { useForm } from "react-hook-form";
import { useCreateSubscriberMutation } from "@/generated/graphql";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AlertCircle, Loader } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

type FormData = {
  email: string;
};

export const SubscribeForm = () => {
  const { register, handleSubmit, formState, reset } = useForm<FormData>();
  const [createSubscriber] = useCreateSubscriberMutation();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await createSubscriber({
        variables: {
          input: {
            email: data.email,
          },
        },
      });

      const result = res.data?.createSubscriber;

      if (result?.success) {
        toast.success("Амжилттай бүртгэгдлээ 🎉", {
          description: result.message,
        });
        reset();
      } else {
        toast.warning("Бүртгэл амжилтгүй", {
          description: result?.message ?? "Алдааны шалтгаан тодорхойгүй",
        });
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      if (errorMessage === "This email is already subscribed") {
        toast.warning("Энэ бүртгэлтэй имэйл хаяг байна.");
      } else {
        toast.error("Алдаа гарлаа", {
          description: "Сервертэй холбогдоход алдаа гарлаа.",
        });
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3"
      >
        <Input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Invalid email format",
            },
          })}
          placeholder="Имайл хаяг"
          className="rouned-sm h-12"
        />

        <Button
          type="submit"
          className="h-12 rounded-sm"
          disabled={formState.isSubmitting}
        >
          {formState.isSubmitting ? (
            <>
              <Loader className="animate-spin" />
              <span className="animate-pulse">Subscribing...</span>
            </>
          ) : (
            "Бүртгүүлэх"
          )}
        </Button>
      </form>
      <AnimatePresence>
        {formState.errors.email && (
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 flex items-center gap-2 font-semibold text-red-500"
            role="alert"
          >
            <AlertCircle size={16} />
            <span className="text-sm">{formState.errors.email.message}</span>
          </motion.span>
        )}
      </AnimatePresence>
      <p className="mt-2 text-xs text-gray-400">
        Бид таны хувийн мэдээллийг хүндэтгэнэ. Спам илгээхгүй.
      </p>
    </div>
  );
};
