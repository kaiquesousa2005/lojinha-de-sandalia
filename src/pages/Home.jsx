import React, { useEffect, useState } from "react";
import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import ProductCard from "../components/ProductCard";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    };

    fetchProducts();
  }, []);

  return (
    <main className="main">
      <section className="hero">
        <h1 className="title">Bem-vinda à Ema's Sandals</h1>
        <p className="description">
          Descubra nossa coleção de calçados femininos elegantes e confortáveis.
        </p>
      </section>

      <section id="about" className="about">
        <h2>Sobre Nós</h2>
        <p>
          Na Ema's Sandals, acreditamos que cada mulher merece se sentir
          confiante e estilosa a cada passo. Nossa paixão é oferecer calçados
          que combinam conforto excepcional com designs deslumbrantes, fazemos
          entrega para toda região de Maracanaú, Maranguape e Fortaleza.
        </p>
      </section>

      <section id="product-grid" className="products">
        <h2>Nossos Produtos</h2>
        <div className="product-grid">
          {products.length === 0 ? (
            <div className="no-products-container">
              <p className="no-products-message">
                Nenhum produto disponível no momento.
              </p>
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                color={product.color}
                sizes={product.sizes}
                stock={product.stock}
                images={product.images}
              />
            ))
          )}
        </div>
      </section>

      <section id="social" className="social">
        <h2>Siga-nos</h2>
        <div className="social-icons">
          <a
            href="https://www.instagram.com/emasandals/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61570507602523"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook />
          </a>
          <a
            href="https://api.whatsapp.com/send?phone=5585988522190"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp />
          </a>
        </div>
      </section>
    </main>
  );
}

export default Home;
