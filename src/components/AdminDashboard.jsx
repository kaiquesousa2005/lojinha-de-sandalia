import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../firebase/firebaseConfig"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import "./AdminDashboard.css"

function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="image-preview">
        <img src={props.url || "/placeholder.svg"} alt={`Preview ${props.index}`} />
        <button onClick={() => props.onDelete(props.index)}>X</button>
      </div>
    </div>
  )
}

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
  const [images, setImages] = useState([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

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
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, `products/${image.name}`)
          await uploadBytes(imageRef, image)
          return getDownloadURL(imageRef)
        }),
      )

      await addDoc(collection(db, "products"), {
        name: newProduct.name,
        price: Number.parseFloat(newProduct.price),
        color: newProduct.color,
        stock: Number.parseInt(newProduct.stock),
        sizes: newProduct.sizes.split(",").map((size) => size.trim()),
        images: imageUrls,
      })
      setNewProduct({ name: "", price: "", color: "", stock: "", sizes: "" })
      setImages([])
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setImages([...images, ...files])
  }

  const handleImageDelete = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.name === active.id)
        const newIndex = items.findIndex((item) => item.name === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
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
        <div className="image-upload">
          <input type="file" multiple onChange={handleImageUpload} accept="image/*" />
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images.map((image) => image.name)} strategy={verticalListSortingStrategy}>
              <div className="image-preview-container">
                {images.map((image, index) => (
                  <SortableItem
                    key={image.name}
                    id={image.name}
                    index={index}
                    url={URL.createObjectURL(image)}
                    onDelete={handleImageDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
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
                <div className="product-images">
                  {product.images &&
                    product.images.map((image, index) => (
                      <img key={index} src={image || "/placeholder.svg"} alt={`${product.name} - ${index + 1}`} />
                    ))}
                </div>
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

