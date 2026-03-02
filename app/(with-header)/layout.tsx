import { Header } from "@/components/layout/header";
import { ThemeProvider } from "@/components/theme/theme-provider";
// import TransitionProvider from "@/providers/transition-grid/transition-provider";
import TransitionProvider from "@/providers/transition-logo/transition-provider";
import "../globals.css";
import { Toaster } from "sonner";


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
          <Toaster />
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
