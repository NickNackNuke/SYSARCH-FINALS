import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../design/UserProductsModal.css'; // Separate CSS for the modal only

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleBuyProduct = (product) => {
    setSelectedProduct(product);
    setQuantity(1); // Default quantity
  };

  const confirmPurchase = async () => {
    if (quantity < 1 || quantity > selectedProduct.qty) {
      alert('Invalid quantity. Please select a valid amount.');
      return;
    }

    try {
      const updatedQuantity = selectedProduct.qty - quantity;
      await axios.put(`http://localhost:3000/api/products/${selectedProduct._id}`, {
        qty: updatedQuantity,
      });

      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod._id === selectedProduct._id
            ? { ...prod, qty: updatedQuantity }
            : prod
        )
      );

      setSuccessMessage(`You successfully purchased ${selectedProduct.name}!`);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error purchasing product:', error);
      alert('Failed to complete purchase. Try again later.');
    }
  };

  return (
    <div className="user-products">
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">BreathEasy</Link>
          <ul className="nav-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/">Logout</Link></li>
          </ul>
        </div>
      </nav>

      <section className="products-hero">
        <h1>Available Products</h1>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="products-list">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
              <h2>{product.name}</h2>
              <p><strong>Price:</strong> ${product.price}</p>
              <p><strong>Available Quantity:</strong> {product.qty}</p>
              <button className="buy-button" onClick={() => handleBuyProduct(product)}>Buy Now</button>
            </div>
          ))}
        </div>
      </section>

      {/* Isolated Modal */}
      {selectedProduct && (
        <div className="user-modal-overlay">
          <div className="user-modal">
            <h2>Purchase {selectedProduct.name}</h2>
            <input
              type="number"
              className="user-modal-input"
              min="1"
              max={selectedProduct.qty}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <div className="user-modal-buttons">
              <button className="user-modal-confirm" onClick={confirmPurchase}>Confirm</button>
              <button className="user-modal-cancel" onClick={() => setSelectedProduct(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProducts;
