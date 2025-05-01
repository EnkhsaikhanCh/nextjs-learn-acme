"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CreditCard, Lock, User, Loader } from "lucide-react";
import { useUserStore } from "@/store/UserStoreState";
import {
  BankName,
  InstructorUserV2,
  PayoutMethod,
  useChangeUserPasswordMutation,
  useGetInstructorUserV2InfoByIdQuery,
  useUpdateInstructorPayoutInfoMutation,
  useUpdateInstructorUserV2Mutation,
} from "@/generated/graphql";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { InstructorProfilePictureUpload } from "../components/AccountComponents/InstructorProfilePictureUpload";
import { signOut } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const { clearUser } = useUserStore.getState();

export default function InstructorAccountPage() {
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);

  const [updateInstructorUserV2] = useUpdateInstructorUserV2Mutation();
  const [changeUserPassword] = useChangeUserPasswordMutation();
  const [updateInstructorPayoutInfo] = useUpdateInstructorPayoutInfoMutation();

  const { user } = useUserStore();

  const {
    data: instructorData,
    loading: instructorLoading,
    error: instructorError,
    refetch: instructorRefetch,
  } = useGetInstructorUserV2InfoByIdQuery({
    variables: { id: user?._id as string },
    skip: !user?._id,
    fetchPolicy: "cache-first",
  });

  // Profile form
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<{ fullName: string; bio: string }>({
    defaultValues: { fullName: "", bio: "" },
  });

  // Password form
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

  // Payout form
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

  // Profile form populate
  useEffect(() => {
    if (instructorData?.getInstructorUserV2InfoById) {
      reset({
        fullName: instructorData.getInstructorUserV2InfoById.fullName || "",
        bio: instructorData.getInstructorUserV2InfoById.bio || "",
      });
    }
  }, [instructorData, reset]);

  // Payout form populate
  useEffect(() => {
    const payout = instructorData?.getInstructorUserV2InfoById.payout;
    if (payout) {
      resetPayoutForm({
        payoutMethod: payout.payoutMethod || PayoutMethod.BankTransfer,
        bankName: payout.bankName || "",
        accountHolderName: payout.accountHolderName || "",
        accountNumber: payout.accountNumber || "",
      });
    }
  }, [instructorData, resetPayoutForm]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  const onSubmitProfile = async (vals: { fullName: string; bio: string }) => {
    setIsProfileUpdating(true);
    try {
      await updateInstructorUserV2({
        variables: {
          id: user._id,
          input: { fullName: vals.fullName, bio: vals.bio },
        },
      });
      await instructorRefetch();
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile", {
        description: (err as Error).message,
      });
    } finally {
      setIsProfileUpdating(false);
    }
  };

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

  if (!user._id || instructorLoading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 p-6 text-sm">
        <p>Loading user account</p>
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }
  if (instructorError) {
    return (
      <div className="flex items-center justify-center gap-2 p-6 text-sm text-red-500">
        <p>Failed to load user account: {(instructorError as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="flex overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Account</h1>
                <p className="text-muted-foreground">
                  Manage your instructor profile and account settings
                </p>
              </div>
            </div>
            <div className="gap-6 space-y-4 md:flex md:items-start md:justify-start">
              <Card className="w-full md:w-1/3 md:max-w-[420px]">
                <CardHeader>
                  <CardTitle>Profile Overview</CardTitle>
                  <CardDescription>
                    Your public instructor profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24 rounded-md">
                      <AvatarImage
                        src={
                          instructorData?.getInstructorUserV2InfoById
                            .profilePicture
                            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${instructorData.getInstructorUserV2InfoById.profilePicture.publicId}.${instructorData.getInstructorUserV2InfoById.profilePicture.format}`
                            : undefined
                        }
                        alt="Instructor Profile Picture"
                      />
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">
                        {instructorData?.getInstructorUserV2InfoById.fullName}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Email
                      </Label>
                      <p className="text-sm font-medium">
                        {instructorData?.getInstructorUserV2InfoById.email}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Bio
                      </Label>
                      <p className="text-sm">
                        {instructorData?.getInstructorUserV2InfoById.bio}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger value="password">
                        <Lock className="mr-2 h-4 w-4" />
                        Password
                      </TabsTrigger>
                      <TabsTrigger value="payout">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payout
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile" className="space-y-4 pt-4">
                      <InstructorProfilePictureUpload
                        userData={
                          instructorData?.getInstructorUserV2InfoById as InstructorUserV2
                        }
                        refetch={instructorRefetch}
                      />
                      <form onSubmit={handleSubmit(onSubmitProfile)}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" {...register("fullName")} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              disabled
                              defaultValue={
                                instructorData?.getInstructorUserV2InfoById
                                  .email
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" rows={4} {...register("bio")} />
                          </div>
                          <Button
                            type="submit"
                            disabled={
                              isProfileUpdating || isSubmitting || !isDirty
                            }
                            className="mt-4"
                          >
                            {isProfileUpdating ? (
                              <Loader className="h-4 w-4 animate-spin" />
                            ) : (
                              "Save Profile"
                            )}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                    <TabsContent value="password" className="space-y-4 pt-4">
                      <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">
                              Current Password
                            </Label>
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
                            <Label htmlFor="confirm-password">
                              Confirm New Password
                            </Label>
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
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Payout Method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectItem
                                        value={PayoutMethod.BankTransfer}
                                      >
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
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
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
                                      <SelectItem
                                        value={BankName.TradeAndDevelopmentBank}
                                      >
                                        TRADE AND DEVELOPMENT BANK
                                      </SelectItem>
                                      <SelectItem value={BankName.XacBank}>
                                        XAC BANK
                                      </SelectItem>
                                      <SelectItem
                                        value={BankName.StateBankOfMongolia}
                                      >
                                        STATE BANK OF MONGOLIA
                                      </SelectItem>
                                      <SelectItem value={BankName.MBank}>
                                        M BANK
                                      </SelectItem>
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
                            <Label htmlFor="account-name">
                              Account Holder Name
                            </Label>
                            <Input
                              id="account-name"
                              {...registerPayout("accountHolderName")}
                            />
                          </div>

                          {/* Account Number */}
                          <div className="space-y-2">
                            <Label htmlFor="account-number">
                              Account Number
                            </Label>
                            <Input
                              id="account-number"
                              {...registerPayout("accountNumber")}
                            />
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
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
