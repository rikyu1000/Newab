import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "New Tab",
  description: "Ultimate minimal dark new tab page for Vimium users.",
};

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: Replace with your actual Client ID from Google Cloud Console
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    "215840872091-tqgrn1o2a3n20ateq68ffvm5te8hu2ik.apps.googleusercontent.com";

  return (
    <html lang="ja">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={clientId}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
