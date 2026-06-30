import './globals.css';

export const metadata = {
  title: 'SPRO Dashboard',
  description: 'SPRO Admin Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
