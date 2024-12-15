import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../design/Products.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    product_code: '',
    name: '',
    description: '',
    price: '',
    qty: ''
  });
  const [editProduct, setEditProduct] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [message, setMessage] = useState('');

  // Fetch products
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  // Add new product
  const handleAddProduct = () => {
    if (
      !newProduct.product_code ||
      !newProduct.name ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.qty
    ) {
      setMessage('Please fill all fields before adding a product!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    axios
      .post('http://localhost:3000/api/products', newProduct)
      .then((response) => {
        setProducts([...products, response.data]);
        setMessage('Product added successfully!');
        setNewProduct({
          product_code: '',
          name: '',
          description: '',
          price: '',
          qty: ''
        });
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((error) => console.error('Error adding product:', error));
  };

  // Delete product
  const handleDeleteProduct = (id) => {
    axios
      .delete(`http://localhost:3000/api/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product._id !== id));
        setMessage('Product deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((error) => console.error('Error deleting product:', error));
  };

  // Edit product
  const handleEditProduct = () => {
    axios
      .put(`http://localhost:3000/api/products/${editProduct._id}`, editValues)
      .then(() => {
        setProducts(
          products.map((product) =>
            product._id === editProduct._id
              ? { ...editProduct, ...editValues }
              : product
          )
        );
        setEditProduct(null);
        setMessage('Product updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch((error) => console.error('Error updating product:', error));
  };

  return (
    <div>
      {/* Admin Navbar */}
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">BreathEasy</Link>
          <ul className="nav-links">
            <li><Link to="/admin/products">Products</Link></li>
            <li><Link to="/admin/profile">Profile</Link></li>
            <li><Link to="/">Logout</Link></li>
          </ul>
        </div>
      </nav>

      {/* Admin Product Management Section */}
      <section className="products-hero">
        <h1>Admin Product Management</h1>
        {message && <p className="success-message">{message}</p>}

        {/* Add Product Form */}
        <div className="add-product-section">
          <h2>Add New Product</h2>
          <div className="add-product-form">
            <input
              type="text"
              placeholder="Product Code"
              value={newProduct.product_code}
              onChange={(e) =>
                setNewProduct({ ...newProduct, product_code: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newProduct.qty}
              onChange={(e) =>
                setNewProduct({ ...newProduct, qty: e.target.value })
              }
            />
            <button className="add-button" onClick={handleAddProduct}>
              Add Product
            </button>
          </div>
        </div>

        {/* Product List */}
        <div className="products-list">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <h2>{product.name}</h2>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Quantity:</strong> {product.qty}</p>
              <div className="button-group" style={{ gap: '10px' }}>
                <button
                  className="edit-button"
                  onClick={() => {
                    setEditProduct(product);
                    setEditValues({
                      product_code: product.product_code,
                      name: product.name,
                      description: product.description,
                      price: product.price,
                      qty: product.qty
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Product Modal */}
     {/* Edit Modal */}
{editProduct && (
  <div className="modal-overlay">
    <div className="edit-modal">
      <h2>Edit Product</h2>
      <input
        type="text"
        placeholder="Product Code"
        value={editValues.product_code}
        onChange={(e) =>
          setEditValues({ ...editValues, product_code: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Name"
        value={editValues.name}
        onChange={(e) =>
          setEditValues({ ...editValues, name: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Description"
        value={editValues.description}
        onChange={(e) =>
          setEditValues({ ...editValues, description: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Price"
        value={editValues.price}
        onChange={(e) =>
          setEditValues({ ...editValues, price: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Quantity"
        value={editValues.qty}
        onChange={(e) =>
          setEditValues({ ...editValues, qty: e.target.value })
        }
      />
      <div className="modal-buttons">
        <button className="save-button" onClick={handleEditProduct}>
          Save Changes
        </button>
        <button
          className="cancel-button"
          onClick={() => setEditProduct(null)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminProducts;
