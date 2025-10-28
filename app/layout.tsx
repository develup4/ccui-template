import type { Metadata } from "next";
import ThemeProvider from "./(commons)/themes/privider";
import "@commons/themes/styles/globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | ArchXplorer",
    default: "ArchXplorer - Architecture Explorer for all-developers",
  },
  icons: { icon: "/images/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-montserrat min-h-screen bg-background text-txt text-xs">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
