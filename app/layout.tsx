import { Header } from "@/components/layout/header";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import TransitionProvider from "@/providers/transition-provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <Toaster position="top-center" />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TransitionProvider>
              <div className="min-h-screen">
                <Header />
                <main className="h-screen pt-16">{children}</main>
              </div>
            </TransitionProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
