import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import RootStyleRegistry from './registry';
import Script from "next/script";

const roboto = Roboto({
    variable: "--font-roboto",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Orbit",
    description: "Powered by Next.JS + AdminLTE + MUI",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="/admin-lte/plugins/aos/aos.css" />
                <link rel="stylesheet" href="/admin-lte/css/adminlte.min.css" />
                <link rel="stylesheet" href="/admin-lte/css/custom.css" />
                <link rel="icon" href="/system-images/f2eb6a1d-e5d2-45b5-8c5c-3458f944e97c.png" sizes="any" />
                <link rel="stylesheet" href="/fontawesome-free/css/all.min.css"></link>
                <link rel="stylesheet" href="/admin-lte/css/cropper.min.css" />
                <Script src="/admin-lte/plugins/jquery/jquery.min.js"></Script>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" />
            </head>
            <body className={`${roboto.className} bg-dark`} suppressHydrationWarning>
                <RootStyleRegistry>
                    {children}
                </RootStyleRegistry>

                <Script src="/admin-lte/plugins/bootstrap/js/bootstrap.bundle.min.js"></Script>
                <Script src="/admin-lte/js/adminlte.min.js"></Script>
                <Script src="/admin-lte/js/custom.js"></Script>
                <Script src="/admin-lte/js/cropper.min.js"></Script>
                <Script src="/admin-lte/js/wizard.js"></Script>
                <Script src="/admin-lte/js/new-image-cropper.js"></Script>
            </body>
        </html>
    );
}
