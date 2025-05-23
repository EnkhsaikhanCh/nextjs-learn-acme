import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { useChangeUserPasswordMutation } from "@/generated/graphql";
import { useUserStore } from "@/store/UserStoreState";
import { Loader } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function InstructorPasswordChange() {
  const { clearUser } = useUserStore.getState();

  const [changeUserPassword] = useChangeUserPasswordMutation();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { isSubmitting: isSubmittingPassword, isDirty: isDirtyPassword },
  } = useForm<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmitPassword = async (vals: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (vals.newPassword !== vals.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const { data } = await changeUserPassword({
        variables: {
          input: {
            oldPassword: vals.oldPassword,
            newPassword: vals.newPassword,
          },
        },
      });

      if (data?.changeUserPassword.success) {
        toast.success("Password updated. Please log in again.");
        resetPasswordForm();
        clearUser();
        await signOut();
      } else {
        toast.error(
          data?.changeUserPassword.message || "Password update failed.",
        );
      }
    } catch (err) {
      toast.error("Internal error.", { description: (err as Error).message });
    }
  };

  return (
    <TabsContent value="password" className="space-y-4 pt-4">
      <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              {...registerPassword("oldPassword")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              {...registerPassword("newPassword")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              {...registerPassword("confirmPassword")}
            />
          </div>
          <Button
            type="submit"
            className="mt-4"
            disabled={isSubmittingPassword || !isDirtyPassword}
          >
            {isSubmittingPassword ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </form>
    </TabsContent>
  );
}
