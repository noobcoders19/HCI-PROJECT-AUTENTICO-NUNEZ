import "./globals.css";
export const metadata = { title: "Student Online Application System" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
