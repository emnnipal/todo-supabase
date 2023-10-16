import { Route } from "@/constants/routes";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect(Route.Home);
  }
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="border p-8 w-96 rounded-xl">{children}</div>
    </div>
  );
}
