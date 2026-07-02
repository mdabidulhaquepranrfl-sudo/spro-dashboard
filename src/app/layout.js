import './globals.css';

export const metadata = {
  title: 'SPRO Dashboard',
  description: 'SPRO Admin Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/assets/vendor/fonts/iconify-icons.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
