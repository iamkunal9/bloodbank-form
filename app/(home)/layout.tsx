import type { Metadata } from "next";
import "file-upload-with-preview/dist/style.css";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Event Form",
  description: "Blood Bank Form",
};

// export const UserContext = createContext<User | null>(null);
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user == null) {
    return redirect("/login");
  }
  return <>{children}</>;
}
