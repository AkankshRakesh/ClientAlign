import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const { supabase } = await createServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth exchange error:", error);
      return NextResponse.redirect(
        requestUrl.origin + "/login?error=auth_error",
      );
    }

    // Ensure profile is created for the user (fallback if trigger didn't work)
    if (data.user) {
      try {
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            email: data.user.email,
            full_name:
              data.user.user_metadata?.full_name ||
              data.user.user_metadata?.name ||
              data.user.email?.split("@")[0],
            avatar_url:
              data.user.user_metadata?.avatar_url ||
              data.user.user_metadata?.picture,
          },
          {
            onConflict: "id",
            ignoreDuplicates: false,
          },
        );

        if (profileError) {
          console.log("Profile upsert info:", profileError.message);
        }
      } catch (profileError) {
        console.log("Profile creation fallback failed:", profileError);
        // Don't fail the auth process if profile creation fails
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + "/projects");
}
