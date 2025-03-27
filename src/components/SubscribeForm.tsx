"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useCreateSubscriberMutation } from "@/generated/graphql";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AlertCircle, Loader } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type FormData = {
  email: string;
};

export const SubscribeForm = () => {
  const { register, handleSubmit, formState, reset } = useForm<FormData>();
  const [createSubscriber] = useCreateSubscriberMutation();
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);

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
        setStatus("success");
        setMessage(result.message);
        setSubscribedEmail(data.email);
        reset();
      } else {
        setStatus("error");
        setMessage("⚠️ " + result?.message);
      }
    } catch {
      setStatus("error");
      setMessage("🚨 Unexpected error occurred");
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
        <AnimatePresence>
          {formState.errors.email && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 font-semibold text-red-500"
              role="alert"
            >
              <AlertCircle size={16} />
              <span className="text-sm">{formState.errors.email.message}</span>
            </motion.span>
          )}
        </AnimatePresence>

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

        {subscribedEmail && status === "success" && (
          <p className="text-xs text-gray-500">
            Subscribed as: {subscribedEmail}
          </p>
        )}
        {message && (
          <div
            className={`rounded p-2 text-sm ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};
