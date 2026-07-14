import "../index.css";
import "../App.css";
import "../styles/landing.css";

export const metadata = {
  title: "Pixelmon — Voxel Legends",
  description: "Pixelmon Voxel Legends — creature-catching voxel adventure",
  manifest: "/manifest.json",
  appleTouchIcon: "/logo192.png",
};

export const viewport = {
  themeColor: "#0d1117",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
