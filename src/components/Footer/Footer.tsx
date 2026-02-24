import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__status">
        <div className="footer__indicator" />
        <span>System Online</span>
      </div>
      <div className="footer__version">v2.4.0 (Stable)</div>
    </footer>
  );
}
