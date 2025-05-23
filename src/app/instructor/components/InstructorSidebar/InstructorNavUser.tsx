import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetUserV2ByIdQuery } from "@/generated/graphql";
import { useUserStore } from "@/store/UserStoreState";
import { ChevronUp, Loader, Loader2, LogOut, SquareUser } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function InstructorNavUser() {
  const { isMobile, open } = useSidebar();
  const { user } = useUserStore();

  const { data: userData, loading } = useGetUserV2ByIdQuery({
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

  const { clearUser } = useUserStore.getState();

  const getProfilePictureUrl = () => {
    if (!userData?.getUserV2ById) {
      return undefined;
    }

    if (
      userData.getUserV2ById.__typename === "InstructorUserV2" &&
      userData.getUserV2ById.profilePicture
    ) {
      return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${userData.getUserV2ById.profilePicture.publicId}.${userData.getUserV2ById.profilePicture.format}`;
    }

    return undefined;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {loading ? (
            <div className="w-ful flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size={"lg"}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar
                  className={`${open ? "ml-0" : "-ml-2"} h-8 w-8 rounded-md`}
                >
                  <AvatarImage
                    src={getProfilePictureUrl() || undefined}
                    alt="Profile picture"
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {userData?.getUserV2ById.__typename === "InstructorUserV2"
                      ? userData.getUserV2ById.fullName
                      : userData?.getUserV2ById.email}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userData?.getUserV2ById.email}
                  </span>
                </div>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          )}

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel>
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">
                    {userData?.getUserV2ById.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <Link
                href={"/instructor/account"}
                className="flex items-center gap-2"
              >
                <SquareUser />
                <span>Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                clearUser();
                await signOut();
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
