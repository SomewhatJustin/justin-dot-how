export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-copyright">&copy; {year} Justin Fowler</div>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/sjustinfowler/" aria-label="LinkedIn">
            LinkedIn
          </a>
          <a
            href="https://github.com/SomewhatJustin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Justin's GitHub"
          >
            GitHub
          </a>
          <a href="https://x.com/somewhatjustin">X/Twitter</a>
          <a href="https://mastodon.social/@justinfowler">Mastodon</a>
        </div>
      </div>
    </footer>
  )
}
