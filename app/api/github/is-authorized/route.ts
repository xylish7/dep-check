import { supabaseApi } from "@/apis/supabase";
import { adminClient } from "@/supabase/clients/admin";
import { serverClient } from "@/supabase/clients/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseClient = await serverClient();

  const { user } = await supabaseApi.auth.getUser(supabaseClient);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const supabaseAdminClient = adminClient();
  const { data: tokensData, error } = await supabaseApi.github.getTokens(
    supabaseAdminClient,
    user.id
  );

  if (error || !tokensData) {
    return NextResponse.json(
      { error: "Unable to fetch tokens" },
      { status: 500 }
    );
  }

  if (tokensData) {
    return NextResponse.json({ authorized: true }, { status: 200 });
  }

  return NextResponse.json({ authorized: false }, { status: 404 });
}
