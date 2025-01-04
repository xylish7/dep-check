import { Metadata } from "next";
import { supabaseApi } from "@/supabase/api";
import { serverClient } from "@/supabase/clients/server";

import LoginCard from "./_components/login-card";

export const metadata: Metadata = {
  title: "Login",
  alternates: { canonical: "/autentificare" },
};

export default async function LoginPage() {
  const { user } = await supabaseApi.auth.getUser(await serverClient());

  return <LoginCard user={user} />;
}
