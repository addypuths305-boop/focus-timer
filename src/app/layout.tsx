import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusTime — Study Break Timer",
  description: "A calm, student-focused productivity app to help you study with focus and take restorative breaks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F3F5F8] text-[#14233D] selection:bg-[#D9E9FF] selection:text-[#14233D]">
        {children}
      </body>
    </html>
  );
}
