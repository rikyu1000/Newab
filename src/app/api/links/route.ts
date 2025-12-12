import { getGoogleAuthClient } from "@/lib/google";
import { google } from "googleapis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getDriveClient() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("google_refresh_token")?.value;

  console.log(
    "API: getDriveClient called. Refresh token exists:",
    !!refreshToken
  );

  if (!refreshToken) {
    // Return null to indicate missing auth, handled by caller
    return null;
  }

  const oauth2Client = getGoogleAuthClient();
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return google.drive({ version: "v3", auth: oauth2Client });
}

export async function GET() {
  try {
    const drive = await getDriveClient();

    if (!drive) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Search for the config file in App Data folder
    const listRes = await drive.files.list({
      spaces: "appDataFolder",
      q: "name = 'quick_links.json'",
      fields: "files(id, name)",
    });

    const files = listRes.data.files;
    if (!files || files.length === 0) {
      // File not found, return empty list (client will use defaults)
      return NextResponse.json([]);
    }

    const fileId = files[0].id;
    if (!fileId) return NextResponse.json([]);

    // Download file content
    const fileRes = await drive.files.get({
      fileId: fileId,
      alt: "media",
    });

    return NextResponse.json(fileRes.data);
  } catch (error: any) {
    console.error("Failed to fetch links from Drive:", error);

    // Check for auth errors from Google API
    const status = error.code || error.status || 500;
    if (status === 401 || error.message === "invalid_grant") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch links" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const drive = await getDriveClient();

    if (!drive) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const links = await request.json();
    const content = JSON.stringify(links);

    // Search for existing file
    const listRes = await drive.files.list({
      spaces: "appDataFolder",
      q: "name = 'quick_links.json'",
      fields: "files(id)",
    });

    const files = listRes.data.files;

    if (files && files.length > 0 && files[0].id) {
      // Update existing file
      await drive.files.update({
        fileId: files[0].id,
        media: {
          mimeType: "application/json",
          body: content,
        },
      });
    } else {
      // Create new file
      await drive.files.create({
        requestBody: {
          name: "quick_links.json",
          parents: ["appDataFolder"],
        },
        media: {
          mimeType: "application/json",
          body: content,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to save links to Drive:", error);

    const status = error.code || error.status || 500;
    if (status === 401 || error.message === "invalid_grant") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to save links" },
      { status: 500 }
    );
  }
}
