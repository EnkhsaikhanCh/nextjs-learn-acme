import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import {
  BankName,
  InstructorUserV2,
  PayoutMethod,
  useUpdateInstructorPayoutInfoMutation,
} from "@/generated/graphql";
import { Loader } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

interface InstructorPayoutSettingsProps {
  instructorData: InstructorUserV2;
  instructorRefetch: () => void;
}

export default function InstructorPayoutSettings({
  instructorData,
  instructorRefetch,
}: InstructorPayoutSettingsProps) {
  const [updateInstructorPayoutInfo] = useUpdateInstructorPayoutInfoMutation();

  const {
    register: registerPayout,
    handleSubmit: handleSubmitPayout,
    control,
    reset: resetPayoutForm,
    formState: { isSubmitting: isSubmittingPayout, isDirty: isDirtyPayout },
  } = useForm<{
    payoutMethod: string;
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
  }>({
    defaultValues: {
      payoutMethod: PayoutMethod.BankTransfer,
      bankName: "",
      accountHolderName: "",
      accountNumber: "",
    },
  });

  useEffect(() => {
    const payout = instructorData?.payout;
    if (payout) {
      resetPayoutForm({
        payoutMethod: payout.payoutMethod || PayoutMethod.BankTransfer,
        bankName: payout.bankName || "",
        accountHolderName: payout.accountHolderName || "",
        accountNumber: payout.accountNumber || "",
      });
    }
  }, [instructorData, resetPayoutForm]);

  const onSubmitPayoutForm = async (vals: {
    payoutMethod: string;
    bankName: string;
    accountHolderName: string;
    accountNumber: string;
  }) => {
    try {
      await updateInstructorPayoutInfo({
        variables: {
          input: {
            payoutMethod: vals.payoutMethod as PayoutMethod,
            bankName: vals.bankName as BankName,
            accountHolderName: vals.accountHolderName,
            accountNumber: vals.accountNumber,
          },
        },
      });

      await instructorRefetch();

      toast.success("Payout information updated.");
    } catch (err) {
      toast.error("Failed to update payout info", {
        description: (err as Error).message,
      });
    }
  };

  return (
    <TabsContent value="payout" className="space-y-4 pt-4">
      <form onSubmit={handleSubmitPayout(onSubmitPayoutForm)}>
        <div className="space-y-4">
          {/* Payout Method */}
          <div className="space-y-2">
            <Label htmlFor="payout-method">Payout Method</Label>
            <Controller
              name="payoutMethod"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Payout Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={PayoutMethod.BankTransfer}>
                        Bank Transfer
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Controller
              name="bankName"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={BankName.KhanBank}>
                        KHAN BANK
                      </SelectItem>
                      <SelectItem value={BankName.GolomtBank}>
                        GOLOMT BANK
                      </SelectItem>
                      <SelectItem value={BankName.TradeAndDevelopmentBank}>
                        TRADE AND DEVELOPMENT BANK
                      </SelectItem>
                      <SelectItem value={BankName.XacBank}>XAC BANK</SelectItem>
                      <SelectItem value={BankName.StateBankOfMongolia}>
                        STATE BANK OF MONGOLIA
                      </SelectItem>
                      <SelectItem value={BankName.MBank}>M BANK</SelectItem>
                      <SelectItem value={BankName.ArigBank}>
                        ARIG BANK
                      </SelectItem>
                      <SelectItem value={BankName.CapitronBank}>
                        CAPITRON BANK
                      </SelectItem>
                      <SelectItem value={BankName.BogdBank}>
                        BOGD BANK
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Account Holder Name */}
          <div className="space-y-2">
            <Label htmlFor="account-name">Account Holder Name</Label>
            <Input id="account-name" {...registerPayout("accountHolderName")} />
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="account-number">Account Number</Label>
            <Input id="account-number" {...registerPayout("accountNumber")} />
          </div>

          <Button
            type="submit"
            disabled={isSubmittingPayout || !isDirtyPayout}
            className="mt-4"
          >
            {isSubmittingPayout ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              "Save Payout Information"
            )}
          </Button>
        </div>
      </form>
    </TabsContent>
  );
}
