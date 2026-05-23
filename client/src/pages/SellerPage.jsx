import React, { useState, useEffect } from 'react';
import { PackagePlus, ShoppingBag, Warehouse, LogOut, User, CheckCircle, Ship } from 'lucide-react';
import '../styles/SellerPage.css';
import useAuth from '../hooks/useAuth';
import { toast } from "react-toastify";
import api from '../api/axios.js';

const SellerPage = () => {
  const [activeTab, setActiveTab] = useState('add-product');
  const [sklad, setSklad] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    category: '',
    quantity: '',
    description: ''
  });

  const { user } = useAuth();

  // Fetch warehouse inventory
  const getProducts = async () => {
    try {
      const res = await api.get("get-pruducts");
      if (res.data.success) {
        setSklad(res.data.product);
      }
    } catch (err) {
      toast.error("Ombor yuklarini yuklashda xatolik!");
    }
  };

  // Fetch client purchase orders
  const getOrders = async () => {
    try {
      const res = await api.get("/get-orders");
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      toast.error("Buyurtmalarni yuklashda xatolik!");
    }
  };

  useEffect(() => {
    getProducts();
    getOrders();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  // Publish target listing items online
  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/create-product", { productData });
      if (res.data.success) {
        toast.success("Yangi tovar yaratildi!");
        setActiveTab("sklad");
        getProducts(); // Refresh warehouse stock list
        setProductData({ name: '', price: '', category: '', quantity: '', description: '' });
      }
    } catch (err) {
      toast.error("Tovar qo'shishda xatolik yuz berdi.");
    }
  };

  // Push pending status states forward
  const changeStatus = async (e, id) => {
    e.preventDefault();
    try {
      const res = await api.post("/change-status", { id });
      if (res.data.success) {
        toast.success("Buyurtma kurerga muvaffaqiyatli topshirildi!");
        getOrders();
      }
    } catch (err) {
      toast.error("Statusni o'zgartirishda xatolik.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR PANEL --- */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">S</div>
          <span className="brand-text">Sotuvchi paneli</span>
        </div>

        <nav className="sidebar-menu">
          <button 
            className={`menu-item ${activeTab === 'add-product' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-product')}
          >
            <PackagePlus size={18} />
            <span>Yangi mahsulot</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'sklad' ? 'active' : ''}`}
            onClick={() => setActiveTab('sklad')}
          >
            <Warehouse size={18} />
            <span>Sklad (Ombor)</span>
          </button>

          <button 
            className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} />
            <span>Buyurtmalar</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar"><User size={14} /></div>
            <div className="user-info">
              <p className="user-name">{user?.name || "Sotuvchi"}</p>
            </div>
          </div>
          <button className="btn-logout" title="Chiqish">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* --- WORKSPACE CORE AREA --- */}
      <main className="dashboard-main">
        
        {/* VIEW TAB 1: ADD PRODUCT FORM */}
        {activeTab === 'add-product' && (
          <section className="view-section">
            <div className="view-header">
              <h1>Yangi mahsulot joylash</h1>
              <p>Xaridorlarga taklif qilish uchun mahsulot tafsilotlarini to'ldiring</p>
            </div>

            <div className="view-card">
              <form onSubmit={addProduct} className="seller-form">
                <div className="form-group">
                  <label>Mahsulot nomi</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={productData.name} 
                    onChange={handleInputChange} 
                    placeholder="Masalan: Erkaklar charm poyabzali" 
                    required 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Narxi (UZS)</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={productData.price} 
                      onChange={handleInputChange} 
                      placeholder="Narxni kiriting" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Miqdori (Zaxira)</label>
                    <input 
                      type="number" 
                      name="quantity" 
                      value={productData.quantity} 
                      onChange={handleInputChange} 
                      placeholder="Dona soni" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>Kategoriya</label>
                    <select name="category" value={productData.category} onChange={handleInputChange} required>
                      <option value="" disabled hidden>Kategoriyani tanlang</option>
                      <option value="kiyim">Kiyim-kechak</option>
                      <option value="elektronika">Elektronika</option>
                      <option value="oziq-ovqat">Oziq-ovqat</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Tavsif (Tafsilotlar)</label>
                  <textarea 
                    name="description" 
                    rows="4" 
                    value={productData.description} 
                    onChange={handleInputChange} 
                    placeholder="Mahsulot haqida batafsil ma'lumot bering..."
                    required 
                  />
                </div>

                <button type="submit" className="btn-publish">Mahsulotni sotuvga chiqarish</button>
              </form>
            </div>
          </section>
        )}

        {/* VIEW TAB 2: INVENTORY / STORAGE GRID */}
        {activeTab === 'sklad' && (
          <section className="view-section text-align-wide">
            <div className="view-header">
              <h1>Omborda mavjud mahsulotlar</h1>
              <p>Sizning joriy zaxirangiz va mahsulotlaringiz holati</p>
            </div>

            <div className="view-card no-padding">
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Mahsulot nomi</th>
                      <th>Narxi</th>
                      <th>Zaxira (Soni)</th>
                      <th>Kategoriya / Izoh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sklad.length === 0 ? (
                      <tr><td colSpan="5" className="table-empty">Ombor bo'sh. Mahsulot qo'shing.</td></tr>
                    ) : (
                      sklad.map(item => (
                        <tr key={item?.id}>
                          <td className="monospace-id">#{item?.id}</td>
                          <td className="table-bold">{item?.name}</td>
                          <td className="table-primary">{Number(item?.cost || 0).toLocaleString()} UZS</td>
                          <td>
                            <span className={`stock-badge ${item?.amount > 5 ? 'in-stock' : 'low-stock'}`}>
                              {item?.amount} dona
                            </span>
                          </td>
                          <td className="table-muted">{item?.title || item?.category || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* VIEW TAB 3: CUSTOMER ORDERS VIEW */}
        {activeTab === 'orders' && (
          <section className="view-section text-align-wide">
            <div className="view-header">
              <h1>Yangi buyurtmalar</h1>
              <p>Xaridorlar tomonidan rasmiylashtirilgan eng so'nggi xaridlar</p>
            </div>

            <div className="view-card no-padding">
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Buyurtma ID</th>
                      <th>Mijoz</th>
                      <th>Mahsulot</th>
                      <th>Soni</th>
                      <th>Umumiy summa</th>
                      <th>Vaqt</th>
                      <th>Manzil</th>
                      <th>Holat / Amal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan="8" className="table-empty">Hozircha yangi buyurtmalar mavjud emas.</td></tr>
                    ) : (
                      orders.map(order => (
                        <tr key={order?.id}>
                          <td className="monospace-id">#{order?.id}</td>
                          <td className="table-bold">{order?.customer_id}</td>
                          <td>{order?.product}</td>
                          <td>{order?.amount} ta</td>
                          <td className="table-primary">{Number(order?.price || 0).toLocaleString()} UZS</td>
                          <td className="table-muted">{formatDate(order?.created_at)}</td>
                          <td className="table-muted">{order?.city}</td>
                          <td>
                            {order?.status === "pending" ? (
                              <button onClick={(e) => changeStatus(e, order.id)} className='btn-dispatch-action'>
                                <Ship size={14} /> Kurerga Berildi
                              </button>
                            ) : (
                              <span className="status-transit-tag"><CheckCircle size={14} /> Kurerga topshirildi</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default SellerPage;