import Script from 'next/script';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Dashboard – SPRO',
  description: 'SPRO Admin Dashboard',
};

export default function DashboardLayout({ children }) {
  return (
    <>
      {/* Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet"
      />

      {/* Sneat Core CSS */}
      <link rel="stylesheet" href="/assets/vendor/fonts/iconify-icons.css" />
      <link rel="stylesheet" href="/assets/vendor/css/core.css" />
      <link rel="stylesheet" href="/assets/css/demo.css" />
      <link rel="stylesheet" href="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />
      <link rel="stylesheet" href="/assets/vendor/libs/apex-charts/apex-charts.css" />

      {/* Sneat Helpers & Config */}
      <Script src="/assets/vendor/js/helpers.js" strategy="afterInteractive" />
      <Script src="/assets/js/config.js" strategy="afterInteractive" />

      {/* Layout wrapper */}
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          {/* Sidebar */}
          <Sidebar />
          {/* /Sidebar */}

          {/* Layout page */}
          <div className="layout-page">
            {/* Navbar */}
            <Navbar />
            {/* /Navbar */}

            {/* Content wrapper */}
            <div className="content-wrapper">
              {/* Content */}
              <div className="container-xxl flex-grow-1 container-p-y">
                {children}
              </div>
              {/* /Content */}

              {/* Footer */}
              <Footer />
              {/* /Footer */}

              <div className="content-backdrop fade" />
            </div>
            {/* /Content wrapper */}
          </div>
          {/* /Layout page */}
        </div>

        {/* Overlay for mobile sidebar */}
        <div className="layout-overlay layout-menu-toggle" />
      </div>
      {/* /Layout wrapper */}

      {/* Core JS – loaded after interactive so Bootstrap can find the DOM */}
      <Script src="/assets/vendor/libs/jquery/jquery.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/libs/popper/popper.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/js/bootstrap.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/js/menu.js" strategy="afterInteractive" />
      <Script src="/assets/vendor/libs/apex-charts/apexcharts.js" strategy="afterInteractive" />
      <Script src="/assets/js/main.js" strategy="afterInteractive" />
    </>
  );
}
