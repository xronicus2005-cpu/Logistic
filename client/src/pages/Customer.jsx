import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, CreditCard, ShieldCheck, Plus, Minus, X, Info } from 'lucide-react';
import '../styles/CustomerPage.css';
import {toast} from "react-toastify"
import api from "../api/axios.js"
import {useNavigate, Link} from "react-router-dom"

const CustomerPage = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('Naqd');
  const [userLocation, setUserLocation] = useState({ lat: '41.3110', lng: '69.2405', city: 'Toshkent shahri' });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [availabe, setAvailabe] = useState([])
  const navigate = useNavigate()



  // Modern HTML5 Geolocation integration API
  const handleFetchLocation = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude.toFixed(4),
            lng: position.coords.longitude.toFixed(4),
            city: "Sizning aniq koordinatangiz"
          });
          setLoadingLocation(false);
        },
        () => {
          alert("Joylashuvni aniqlashga ruxsat berilmadi. Standart shahar sozlandi.");
          setLoadingLocation(false);
        }
      );
    } else {
      alert("Sizning brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.");
      setLoadingLocation(false);
    }
  };

  const getAvailabePruducts = async () => {
    try{
      const res = await api.get("/get-availabe")

      if(res.data.success){
        setAvailabe(res.data.product)
      }
    }
    catch(err){
      toast.info("Xatolik")
    }
  }

  useEffect(() => {
    getAvailabePruducts()
  }, [])

  const handleOpenOrder = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const submitOrder = async (e) => {
    e.preventDefault();

    try{
      const res = await api.post("/order", {
        product: selectedProduct?.name,
        amount: quantity,
        payment: paymentMethod,
        location: userLocation,
        seller_id: selectedProduct?.seller_id,
        price: selectedProduct.cost * quantity
      })

      if(res.data.success){
        navigate("/orders")
      }
    }
    catch(err){
      toast.info("Xatolik")
    }


    alert("Buyurtmangiz qabul qilindi! Kurer tez orada bog'lanadi.");
    setSelectedProduct(null);
  };

  return (
    <div className="marketplace-container">
      {/* --- HERO HEADER --- */}
      <header className="market-header">
        <div>
          <h1>Mahsulotlar katalogi</h1>
          <p>Mavjud barcha sifatli mahsulotlar bir joyda</p>
        </div>
        <Link to="/orders">
          <div className="cart-badge-wrapper">
            <ShoppingCart size={22} />
            <span className="cart-count">{availabe.length}</span>
          </div>
        </Link>
        
      </header>

      {/* --- PRODUCT DISPLAY GRID --- */}
      <div className="products-grid">
        {availabe.map((product) => (
          <div key={product?.id} className="product-card">
            
            <div className="product-details">
              <span className="product-tag">{product?.category}</span>
              <h3 className="product-name">{product?.name}</h3>
              <p className="product-price">{product?.cost?.toLocaleString('uz-UZ')} UZS</p>
              <button className="btn-order-trigger" onClick={() => handleOpenOrder(product)}>
                Sotib olish
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- SLIDE-OVER ORDER MODAL SHEET --- */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProduct(null)}>
              <X size={20} />
            </button>

            <div className="modal-header">
              <h2>Buyurtmani rasmiylashtirish</h2>
              <p>Quyidagi ma'lumotlarni to'ldiring</p>
            </div>

            {/* Inline Mini-Product Info Preview */}
            <div className="mini-product-preview">
              
              <div>
                <h4>{selectedProduct?.name}</h4>
                <p>{selectedProduct?.cost?.toLocaleString('uz-UZ')} UZS</p>
              </div>
            </div>

            <form onSubmit={submitOrder} className="order-form">
              {/* Parameter 1: Quantity Control */}
              <div className="order-field-group">
                <label>Mahsulot miqdori (Dona)</label>
                <div className="quantity-stepper">
                  <button 
                    type="button" 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button 
                    type="button" 
                    onClick={() => setQuantity(q => Math.min(selectedProduct.amount, q + 1))}
                    disabled={quantity >= selectedProduct?.amount}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Parameter 2: Clean MAP Display Location Interface */}
              <div className="order-field-group">
                <label>Yetkazib berish manzili (Xarita)</label>
                <div className="interactive-map-box">
                  <div className="map-placeholder-ui">
                    <MapPin size={32} className="animated-pin" />
                    <p className="map-coordinates">Kenglik: {userLocation.lat} / Uzunlik: {userLocation.lng}</p>
                    <p className="map-city-label">{userLocation.city}</p>
                  </div>
                  <button type="button" className="btn-gps" onClick={handleFetchLocation} disabled={loadingLocation}>
                    {loadingLocation ? "Aniqlanmoqda..." : "Hozirgi joylashuvni aniqlash"}
                  </button>
                </div>
              </div>

              {/* Parameter 3: Clean Method Selectors */}
              <div className="order-field-group">
                <label>To'lov turi</label>
                <div className="payment-selector-grid">
                  <div 
                    className={`payment-card ${paymentMethod === 'Naqd' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('Naqd')}
                  >
                    <CreditCard size={18} />
                    <span>Naqd pul bilan</span>
                  </div>
                  <div 
                    className={`payment-card ${paymentMethod === 'Karta' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('Karta')}
                  >
                    <ShieldCheck size={18} />
                    <span>Plastik karta (Online)</span>
                  </div>
                </div>
              </div>

              {/* Summary checkout display panel */}
              <div className="checkout-summary">
                <div className="summary-row">
                  <span>Jami summa:</span>
                  <strong>{(selectedProduct.cost * quantity).toLocaleString('uz-UZ')} UZS</strong>
                </div>
              </div>

              <button type="submit" className="btn-finalize-order">
                Buyurtmani tasdiqlash
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;