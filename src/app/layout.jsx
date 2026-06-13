import '../index.css';
import '../App.css';

export const metadata = {
  title: 'Pixelmon — Voxel Legends',
  description: 'Pixelmon Voxel Legends — creature-catching voxel adventure',
  manifest: '/manifest.json',
  appleTouchIcon: '/logo192.png',
};

export const viewport = {
  themeColor: '#0d1117',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
