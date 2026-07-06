import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://axelvalle.dev"),
  title: {
    default: "Axel Valle — Systems Engineer",
    template: "%s | Axel Valle",
  },
  description:
    "Portfolio de Axel Valle, estudiante de Ingeniería en Sistemas y desarrollador móvil y web. Proyectos, certificaciones y redes.",
  applicationName: "Axel Valle Portfolio",
  authors: [{ name: "Axel Valle", url: "https://github.com/axelvalle" }],
  keywords: [
    "Axel Valle",
    "Systems Engineer",
    "Portfolio",
    "Mobile Developer",
    "Web Developer",
    "Flutter",
    "Angular",
    "PHP",
    "Python",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://axelvalle.dev",
    siteName: "Axel Valle Portfolio",
    title: "Axel Valle — Systems Engineer",
    description:
      "Portfolio de Axel Valle, desarrollador móvil y web. Sistemas, tecnologías y proyectos.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Axel Valle — Systems Engineer",
    description: "Portfolio de Axel Valle, desarrollador móvil y web.",
    creator: "@perpetua_v",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FF8C1A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}