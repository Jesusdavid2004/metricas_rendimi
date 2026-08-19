import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laboratorio de Rendimiento del Event Loop",
  description: "Una demostración interactiva del rendimiento del Event Loop de JavaScript",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
