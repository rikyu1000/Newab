import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  cookies().delete("google_refresh_token");
  return NextResponse.redirect(new URL("/", request.url));
}
