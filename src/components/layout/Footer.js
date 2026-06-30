export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="content-footer footer bg-footer-theme">
      <div className="container-xxl">
        <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
          <div className="mb-2 mb-md-0">
            © {year}, made with ❤️ by{' '}
            <a href="https://themeselection.com" target="_blank" rel="noreferrer" className="footer-link">
              ThemeSelection
            </a>
          </div>
          <div className="d-none d-lg-inline-block">
            <a
              href="https://themeselection.com/license/"
              className="footer-link me-4"
              target="_blank"
              rel="noreferrer"
            >
              License
            </a>
            <a
              href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/documentation/"
              target="_blank"
              rel="noreferrer"
              className="footer-link me-4"
            >
              Documentation
            </a>
            <a
              href="https://github.com/themeselection/sneat-bootstrap-html-admin-template-free/issues"
              target="_blank"
              rel="noreferrer"
              className="footer-link"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
