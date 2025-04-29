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
  useGetUserV2ByIdQuery,
  UserV2,
  useUpdateInstructorUserV2Mutation,
} from "@/generated/graphql";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { InstructorProfilePictureUpload } from "../components/AccountComponents/InstructorProfilePictureUpload";

export default function InstructorAccountPage() {
  const [isProfileUpdating, setIsProfileUpdating] = useState<boolean>(false);
  const [updateInstructorUserV2] = useUpdateInstructorUserV2Mutation();

  const { user } = useUserStore();

  const {
    data: userData,
    loading,
    error,
    refetch,
  } = useGetUserV2ByIdQuery({
    variables: { id: user?._id as string },
    skip: !user?._id,
    fetchPolicy: "cache-first",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      fullName: "",
      bio: "",
    },
  });

  // userData ирсний дараа form утгуудыг populate хийх
  useEffect(() => {
    if (userData?.getUserV2ById.__typename === "InstructorUserV2") {
      reset({
        fullName: userData.getUserV2ById.fullName || "",
        bio: userData.getUserV2ById.bio || "",
      });
    }
  }, [userData, reset]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  const onSubmit = async (values: { fullName: string; bio: string }) => {
    setIsProfileUpdating(true);
    try {
      await updateInstructorUserV2({
        variables: {
          id: user?._id as string,
          input: {
            fullName: values.fullName,
            bio: values.bio,
          },
        },
      });

      await refetch();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile", {
        description: (error as Error).message,
      });
    } finally {
      setIsProfileUpdating(false);
    }
  };

  if (!user?._id || loading) {
    return (
      <div className="text-muted-foreground flex items-center justify-center gap-2 p-6 text-sm">
        <p>Loading user account</p>
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    const errorMessage = (error as Error).message;
    return (
      <div className="flex items-center justify-center gap-2 p-6 text-sm text-red-500">
        <p>Failed to load user account: ${errorMessage}</p>
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

            <div className="grid gap-5 md:grid-cols-3">
              {/* Profile Overview Card */}
              <Card className="md:col-span-1">
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
                          userData?.getUserV2ById.__typename ===
                            "InstructorUserV2" &&
                          userData?.getUserV2ById.profilePicture
                            ? `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${userData.getUserV2ById.profilePicture.publicId}.${userData.getUserV2ById.profilePicture.format}`
                            : undefined
                        }
                        alt="Instructor Profile Picture"
                      />
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">
                        {userData?.getUserV2ById.role === "INSTRUCTOR" &&
                          userData?.getUserV2ById.__typename ===
                            "InstructorUserV2" &&
                          userData?.getUserV2ById.fullName}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Email
                      </Label>
                      <p className="text-sm font-medium">
                        {userData?.getUserV2ById.email}
                      </p>
                    </div>

                    <div>
                      <Label className="text-muted-foreground text-xs">
                        Bio
                      </Label>
                      <p className="text-sm">
                        {userData?.getUserV2ById.role === "INSTRUCTOR" &&
                        userData?.getUserV2ById.__typename ===
                          "InstructorUserV2"
                          ? userData?.getUserV2ById.bio ||
                            "No bio provided yet."
                          : null}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Settings Tabs */}
              <Card className="md:col-span-2">
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
                        <span className="hidden sm:inline">Profile</span>
                      </TabsTrigger>
                      <TabsTrigger value="password">
                        <Lock className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Password</span>
                      </TabsTrigger>
                      <TabsTrigger value="payout">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Payout</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* Profile Update Form */}
                    <TabsContent value="profile" className="space-y-4 pt-4">
                      <InstructorProfilePictureUpload
                        userData={userData?.getUserV2ById as UserV2}
                        refetch={refetch}
                      />

                      <form onSubmit={handleSubmit(onSubmit)}>
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
                              defaultValue={userData?.getUserV2ById.email}
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

                    {/* Password Update Form */}
                    <TabsContent value="password" className="space-y-4 pt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">
                            Current Password
                          </Label>
                          <Input id="current-password" type="password" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">
                            Confirm New Password
                          </Label>
                          <Input id="confirm-password" type="password" />
                        </div>

                        <Button className="mt-4">Update Password</Button>
                      </div>
                    </TabsContent>

                    {/* Payout Setup Form */}
                    <TabsContent value="payout" className="space-y-4 pt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="payout-method">Payout Method</Label>
                          <select
                            id="payout-method"
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="bank">Bank Transfer</option>
                            <option value="paypal">PayPal</option>
                            <option value="stripe">Stripe</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="account-name">
                            Account Holder Name
                          </Label>
                          <Input id="account-name" defaultValue="Jane Doe" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="account-number">Account Number</Label>
                          <Input
                            id="account-number"
                            defaultValue="XXXX-XXXX-XXXX-4321"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="routing-number">Routing Number</Label>
                          <Input
                            id="routing-number"
                            defaultValue="XXX-XXX-XXX"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tax-id">Tax ID (Optional)</Label>
                          <Input id="tax-id" placeholder="Enter your tax ID" />
                        </div>

                        <Button className="mt-4">
                          Save Payout Information
                        </Button>
                      </div>
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
