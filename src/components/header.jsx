import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import logoImage from "../LOGO MANU.jpg"
import "./header.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  return (
    <header className="header">
      <div className="header-content">
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <Link to="/" className="logo-container">
          <img src={logoImage} alt="Ema's Sandals Logo" className="logo" />
        </Link>
        <nav className={`nav ${isMenuOpen ? "open" : ""}`}>
          <ul>
            <li>
            <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault(); // Evita o recarregamento da página
                  setIsMenuOpen(false);
                  document
                    .getElementById("product-grid")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Produtos
              </Link>
            </li>
            <li>
            <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault(); // Evita o recarregamento da página
                  setIsMenuOpen(false);
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault(); // Evita o recarregamento da página
                  setIsMenuOpen(false);
                  document
                    .getElementById("social")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Contato
              </Link>
            </li>
          </ul>
        </nav>
        <Link to="/cart" className="cart-icon">
          <FaShoppingCart />
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </Link>
      </div>
    </header>
  );
}

export default Header;
