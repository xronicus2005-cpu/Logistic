import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, Truck, ArrowRight, ShoppingBag } from 'lucide-react';
import '../styles/CustomerOrders.css';
import {toast} from "react-toastify"
import api from "../api/axios.js"

const CustomerOrders = () => {

    const [myOrders, setMyOrders] = useState([])
  // Mock data for user's order history and active shipments
  

  const getOrders = async () => {
    try{
        const res = await api.get("/my-orders")

        if(res.data.success){
            setMyOrders(res.data.orders)
        }
    }
    catch(err){
        toast.info("Xatolik!")
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  console.log(myOrders)

  // Helper to render clean status text badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-indicator step-waiting"><Clock size={14} /> Tasdiqlash kutilmoqda</span>;
      case 'onRoad':
        return <span className="status-indicator step-shipping"><Truck size={14} /> Kurier yo'lda</span>;
      case 'completed':
        return <span className="status-indicator step-done"><CheckCircle2 size={14} /> Yetkazib berildi</span>;
      default:
        return null;
    }
  };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

  return (
    <div className="orders-page-container">
      {/* --- PAGE SUB-HEADER --- */}
      <header className="orders-page-header">
        <div>
          <h1>Mening buyurtmalarim</h1>
          <p>Siz tomoningizdan xarid qilingan mahsulotlar va ularning yetkazib berish holatlari</p>
        </div>
        <div className="orders-summary-pill">
          <ShoppingBag size={18} />
          <span>Jami {myOrders.length} ta buyurtma</span>
        </div>
      </header>

      {/* --- ORDERS CARDS LIST --- */}
      <div className="orders-feed">
        {myOrders.map((order) => (
          <div key={order?.id} className="order-history-card">
            
            {/* Top row with ID, Meta info, and overall Tag status */}
            <div className="order-card-top">
              <div className="order-main-meta">
                <span className="order-hash">#{order?.id}</span>
                <span className="order-timestamp">{formatDate(order?.created_at)}</span>
              </div>
              {getStatusBadge(order?.status)}
            </div>

            {/* Middle Row with item information */}
            <div className="order-card-body">
              <div className="product-info-cluster">
                <div className="package-box-icon"><Package size={20} /></div>
                <div>
                  <h3>{order?.product}</h3>
                  <p className="product-subtext">{order?.amount} dona &bull; {order.payment} orqali</p>
                </div>
              </div>
              <div className="order-price-summary">
                <label>Umumiy summa</label>
                <p>{order?.price}</p>
              </div>
            </div>

            {/* Visual Tracking Progress Timeline bar */}
            <div className="order-tracking-timeline">
              <div className="timeline-rail">
                <div className="timeline-fill" style={{ width: `${order.progress}%` }}></div>
              </div>
              <div className="timeline-points">
                <div className="point completed">
                  <span className="dot"></span>
                  <span className="label">Qabul qilindi</span>
                </div>
                <div className={`point ${order?.progress >= 50 ? 'completed' : ''}`}>
                  <span className="dot"></span>
                  <span className="label">Yo'lda / Kurerda</span>
                </div>
                <div className={`point ${order?.progress === 100 ? 'completed' : ''}`}>
                  <span className="dot"></span>
                  <span className="label">Topshirildi</span>
                </div>
              </div>
            </div>

            {/* Bottom operational courier metadata line */}
            <div className="order-card-footer">
              <p><span>Kurer:</span> {order.driver}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerOrders;