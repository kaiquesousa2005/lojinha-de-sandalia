import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Logo from "../LOGO MANU.jpg";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    neighborhood: "",
    complement: "",
    region: "",
  });

  const shippingCosts = {
    Fortaleza: 25,
    Maranguape: 15,
    Maracanaú: 20,
  };

  const shippingCost = shippingCosts[formData.region] || 0;
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const total = subtotal + shippingCost;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== ""
  );

  const handleWhatsAppOrder = () => {
    if (!isFormValid) {
      alert(
        "Por favor, preencha todos os campos do formulário antes de finalizar o pedido."
      );
      return;
    }

    let message = "Olá, gostaria de fazer o seguinte pedido:\n\n";
    cart.forEach((item) => {
      message += `${item.name} - Quantidade: ${item.quantity} - R$ ${(
        item.price * item.quantity
      ).toFixed(2)}\n`;
    });
    message += `\nSubtotal: R$ ${subtotal.toFixed(2)}`;
    message += `\nFrete: R$ ${shippingCost.toFixed(2)}`;
    message += `\nTotal: R$ ${total.toFixed(2)}`;
    message += "\n\nDados de entrega:";
    message += `\nNome: ${formData.name}`;
    message += `\nEndereço: ${formData.address}`;
    message += `\nBairro: ${formData.neighborhood}`;
    message += `\nComplemento: ${formData.complement}`;
    message += `\nRegião: ${formData.region}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5585985818139?text=${encodedMessage}`);
  };

  const navigate = useNavigate();

  return (
    <div className="cart-page">
      <h1>Seu Carrinho</h1>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <img src={Logo} alt="Carrinho Vazio" className="empty-cart-icon" />
          <p>Seu carrinho está vazio.</p>
          <p>Adicione alguns produtos à sua cesta!</p>
          <button
            className="go-to-products-button"
            onClick={() => navigate("/")}
          >
            Continue comprando
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.images}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>R$ {item.price.toFixed(2)}</p>
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-button"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
            <p>Frete da Região: R$ {shippingCost.toFixed(2)}</p>
            <p>Total: R$ {total.toFixed(2)}</p>
          </div>
          <form className="delivery-form">
            <h2>Dados de Entrega</h2>
            <select
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecione a Região</option>
              <option value="Fortaleza">Fortaleza</option>
              <option value="Maranguape">Maranguape</option>
              <option value="Maracanaú">Maracanaú</option>
            </select>
            <input
              type="text"
              name="name"
              placeholder="Nome"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Endereço + N° da Casa"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="neighborhood"
              placeholder="Bairro"
              value={formData.neighborhood}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="complement"
              placeholder="Complemento"
              value={formData.complement}
              onChange={handleInputChange}
              required
            />
          </form>
          <button
            onClick={handleWhatsAppOrder}
            className="whatsapp-button"
            disabled={!isFormValid}
          >
            Finalizar Pedido via WhatsApp
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
