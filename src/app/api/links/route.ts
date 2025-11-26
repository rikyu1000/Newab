import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getGoogleAuthClient } from "@/lib/google";
import {
    getDriveClient,
    findConfigFile,
    createConfigFile,
    getConfigFileContent,
    updateConfigFile,
} from "@/lib/drive";

export const dynamic = "force-dynamic";

async function getAuthenticatedDriveClient() {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("google_refresh_token")?.value;

    if (!refreshToken) {
        return null;
    }

    const auth = getGoogleAuthClient();
    auth.setCredentials({ refresh_token: refreshToken });
    return getDriveClient(auth);
}

export async function GET() {
    try {
        const drive = await getAuthenticatedDriveClient();
        if (!drive) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const file = await findConfigFile(drive);
        if (!file) {
            return NextResponse.json([]);
        }

        const content = await getConfigFileContent(drive, file.id);
        return NextResponse.json(content);
    } catch (error) {
        console.error("Sync error:", error);
        return NextResponse.json(
            { error: "Failed to sync links" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const drive = await getAuthenticatedDriveClient();
        if (!drive) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const links = await request.json();
        const file = await findConfigFile(drive);

        if (file) {
            await updateConfigFile(drive, file.id, links);
        } else {
            await createConfigFile(drive, links);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Save error:", error);
        return NextResponse.json(
            { error: "Failed to save links" },
            { status: 500 }
        );
    }
}
