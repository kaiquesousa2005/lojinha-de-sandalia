import React from "react"
import { FaHeart } from "react-icons/fa"
import "./footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">
          Feito com <FaHeart className="heart-icon" /> para todas as mulheres estilosas
        </p>
        <nav className="footer-nav">
          <a href="#about">Sobre</a>
          <a href="#product-grid">Produtos</a>
          <a href="#social">Contato</a>
        </nav>
      </div>
      <div className="copyright">© 2025 Ema's Sandales. Todos os direitos reservados.</div>
    </footer>
  )
}

export default Footer

