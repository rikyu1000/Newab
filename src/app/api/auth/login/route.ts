import { getGoogleAuthClient } from "@/lib/google";
import { NextResponse } from "next/server";

export async function GET() {
  const oauth2Client = getGoogleAuthClient();

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events.readonly"],
    prompt: "consent", // Force refresh token generation
  });

  return NextResponse.redirect(url);
}
