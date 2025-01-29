import React, { useState, useEffect } from "react"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import "./AdminDashboard.css"

function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    color: "",
    stock: "",
    sizes: "",
  })
  const [editingProduct, setEditingProduct] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"))
    const productsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    setProducts(productsData)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }

  const addProduct = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: Number.parseFloat(newProduct.price),
        color: newProduct.color,
        stock: Number.parseInt(newProduct.stock),
        sizes: newProduct.sizes.split(",").map((size) => size.trim()),
        imageUrl: `/images/${newProduct.name.toLowerCase().replace(/\s+/g, "-")}.jpg`,
      })
      setNewProduct({ name: "", price: "", color: "", stock: "", sizes: "" })
      fetchProducts()
    } catch (error) {
      console.error("Error adding product: ", error)
    }
  }

  const updateProduct = async (id, updatedData) => {
    try {
      await updateDoc(doc(db, "products", id), updatedData)
      fetchProducts()
      setEditingProduct(null)
    } catch (error) {
      console.error("Error updating product: ", error)
    }
  }

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id))
      fetchProducts()
    } catch (error) {
      console.error("Error deleting product: ", error)
    }
  }

  const startEditing = (product) => {
    setEditingProduct({ ...product, sizes: product.sizes.join(", ") })
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <form onSubmit={addProduct} className="product-form">
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Nome do Produto"
          required
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Preço"
          required
        />
        <input
          type="text"
          name="color"
          value={newProduct.color}
          onChange={handleInputChange}
          placeholder="Cor"
          required
        />
        <input
          type="number"
          name="stock"
          value={newProduct.stock}
          onChange={handleInputChange}
          placeholder="Estoque"
          required
        />
        <input
          type="text"
          name="sizes"
          value={newProduct.sizes}
          onChange={handleInputChange}
          placeholder="Tamanhos (separados por vírgula)"
          required
        />
        <button type="submit">Adicionar produto</button>
      </form>
      <div className="product-list">
        <h3>Produtos Disponíveis ({products.length})</h3>
        {products.map((product) => (
          <div key={product.id} className="product-item">
            {editingProduct && editingProduct.id === product.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  updateProduct(product.id, {
                    ...editingProduct,
                    price: Number.parseFloat(editingProduct.price),
                    stock: Number.parseInt(editingProduct.stock),
                    sizes: editingProduct.sizes.split(",").map((size) => size.trim()),
                  })
                }}
                className="edit-form"
              >
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                />
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                />
                <input
                  type="text"
                  value={editingProduct.color}
                  onChange={(e) => setEditingProduct({ ...editingProduct, color: e.target.value })}
                />
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                />
                <input
                  type="text"
                  value={editingProduct.sizes}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value })}
                />
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setEditingProduct(null)}>
                  Cancelar
                </button>
              </form>
            ) : (
              <>
                <h4>{product.name}</h4>
                <p>Preço: R$ {product.price.toFixed(2)}</p>
                <p>Cor: {product.color}</p>
                <p>Estoque: {product.stock}</p>
                <p>Tamanhos: {product.sizes.join(", ")}</p>
                <button onClick={() => startEditing(product)}>Editar</button>
                <button onClick={() => deleteProduct(product.id)}>Excluir</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard

