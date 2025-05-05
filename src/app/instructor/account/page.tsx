"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Lock, User, Loader } from "lucide-react";
import { useUserStore } from "@/store/UserStoreState";
import {
  InstructorUserV2,
  useGetInstructorUserV2InfoByIdQuery,
} from "@/generated/graphql";
import ProfileOverview from "../components/AccountComponents/ProfileOverview";
import ProfileSettings from "../components/AccountComponents/ProfileSettings";
import InstructorPasswordChange from "../components/AccountComponents/InstructorPasswordChange";
import InstructorPayoutSettings from "../components/AccountComponents/InstructorPayoutSettings";

export default function InstructorAccountPage() {
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

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

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
              <ProfileOverview
                instructorData={
                  instructorData?.getInstructorUserV2InfoById as InstructorUserV2
                }
              />

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

                    <ProfileSettings
                      instructorData={
                        instructorData?.getInstructorUserV2InfoById as InstructorUserV2
                      }
                      instructorRefetch={instructorRefetch}
                      userId={user._id}
                    />

                    <InstructorPasswordChange />

                    <InstructorPayoutSettings
                      instructorData={
                        instructorData?.getInstructorUserV2InfoById as InstructorUserV2
                      }
                      instructorRefetch={instructorRefetch}
                    />
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
