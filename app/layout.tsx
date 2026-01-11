import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "康复助手 - 脑梗康复训练记录",
  description: "帮助脑梗康复患者记录和管理日常康复训练",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Navigation />
        <main className="w-full min-h-[calc(100vh-4rem)] py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
