import ClientLayout from "@/providers/ClientLayout";
// import { cookies } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const cookieStore = await cookies();
  // const defaultOpen = cookieStore.get("sidebar:state")?.value === "false";

  return <ClientLayout>{children}</ClientLayout>;
}
