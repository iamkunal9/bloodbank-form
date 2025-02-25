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
  return <><div className="relative">
  {/* Background image div */}
  <div
    className="absolute md:block hidden inset-0 bg-[url('/bg.png')] bg-cover bg-center opacity-50 z-0" style={{ backgroundSize: "20% auto", backgroundRepeat: "no-repeat" }}
  ></div>
  {/* Content div */}
  <div className="relative z-10">
    {children}
  </div>
</div></>;
}
