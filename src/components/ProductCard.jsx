import { useCart } from "../context/CartContext"
import "./ProductCard.css"

function ProductCard({ id, name, price, color, sizes, images, stock }) {
  const { addToCart } = useCart()


  return (
    <div className="product-card">
      
      <div className="product-info">
      <img className="product-image" src={images} alt={name} />
        <h3 className="product-name">{name}</h3>
        <p className="product-price">R$ {price.toFixed(2)}</p>
        <p className="product-color">Cor: {color}</p>
        <p className="product-sizes">Tamanhos: {sizes.join(", ")}</p>
        <p className="product-stock">Unidades: {stock}</p>
      </div>
      <button className="product-button" onClick={() => addToCart({ id, name, price, color, sizes, images, stock })}>
        Adicionar ao Carrinho
      </button>
    </div>
  )
}

export default ProductCard

