import React, { useEffect, useState } from 'react';
import { MapPin, Phone, CheckCircle2, Navigation, Package, User, Check, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import '../styles/DriverPage.css';
import api from "../api/axios.js";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth.js";

// Leaflet marker piktogrammalari xatosini to'g'rilash
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Xaritada ikki nuqta o'rtasida yo'l chizuvchi maxsus sub-komponent
const RoutingMachine = ({ userCoords, targetCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !userCoords || !targetCoords) return;

    // Yo'nalish chizgichini yaratish
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userCoords[0], userCoords[1]), // Boshlanish: Kurer joylashuvi
        L.latLng(targetCoords[0], targetCoords[1]) // Tugash: Mijoz manzili
      ],
      lineOptions: {
        styles: [{ color: '#2563eb', weight: 5, opacity: 0.8 }]
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false // Navigatsiya matnli yo'riqnomasini yashirish
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, userCoords, targetCoords]);

  return null;
};

const DriverPage = () => {
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [courierCoords, setCourierCoords] = useState([41.311081, 69.240562]); // Standart: Toshkent markazi
  const { user } = useAuth();

  // Kurerning real vaqtdagi GPS joylashuvini aniqlash
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCourierCoords([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          toast.warning("GPS aniqlanmadi. Standart joylashuvdan foydalaniladi.");
        }
      );
    }
  }, []);

  // Erkin buyurtmalar ro'yxatini yuklash
  const getOrders = async () => {

    if(!user) return

    try {
      const res = await api.get("/get-delivery");
      if (res.data.success) {
        setAvailableOrders(res.data.orders);
        
        // Agar kurer sahifani yangilasa va unda aktiv buyurtma bo'lsa, uni tiklash
        const ongoing = res.data.orders.find(o => Number(o?.driver_id) === Number(user?.id) && o?.progress === '50');
        if (ongoing) {
          setActiveDelivery(ongoing);
        }
      }
    } catch (err) {
      toast.error("Buyurtmalarni yuklashda xatolik yuz berdi!");
    }
  };

  useEffect(() => {
    if (user) getOrders();
  }, [user]);

  // Step 1: Yukni qabul qilish va backendni yangilash
  const handleAcceptDelivery = async (order) => {
    try {
      // Backendga so'rov yuborish (progress: 50, driver: ism familiya)
      const res = await api.post("/accept-delivery", {
        orderId: order.id,
        driverName: `${user?.name} ${user?.last_name}`
      });

      if (res.data.success) {
        setActiveDelivery(order);
        setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
        toast.success("Yuk qabul qilindi! Yo'lga tushishingiz mumkin.");
      }
    } catch (err) {
      toast.error("Buyurtmani qabul qilishda xatolik yuz berdi.");
    }
  };

  // Step 2: Buyurtma muvaffaqiyatli yetkazilganda
  const handleCompleteDelivery = async () => {
    try {
      const res = await api.post("/complete-delivery", {
        orderId: activeDelivery.id
      });

      if (res.data.success) {
        toast.success(`Buyurtma #${activeDelivery.id} mijozga topshirildi!`);
        setActiveDelivery(null);
        getOrders(); // Ro'yxatni qayta yangilash
      }
    } catch (err) {
      toast.error("Xatolik yuz berdi, qaytadan urinib ko'ring.");
    }
  };

  return (
    <div className="driver-container">
      {/* --- DRIVER PROFILE TOP BAR --- */}
      <header className="driver-header">
        <div className="driver-identity">
          <div className="driver-avatar"><Navigation size={18} /></div>
          <div>
            <h1>Kurer paneli</h1>
            <p>Xizmat ko'rsatuvchi kurer: <strong>{user?.name} {user?.last_name}</strong></p>
          </div>
        </div>
        <div className={`status-pill ${activeDelivery ? 'busy' : 'free'}`}>
          <span className="pulse-dot"></span>
          {activeDelivery ? "Yetkazib berish jarayonida" : "Yangi buyurtma kutilmoqda"}
        </div>
      </header>

      {/* --- MAP & ACTIVE ROW DISPLAY --- */}
      {activeDelivery && (
        <section className="map-routing-section">
          <div className="view-card no-padding map-wrapper">
            <MapContainer center={courierCoords} zoom={13} style={{ height: "400px", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Kurer belgisi */}
              <Marker position={courierCoords}>
                <Popup>Sizning joriy joylashuvingiz</Popup>
              </Marker>
              
              {/* Mijoz belgisi */}
              <Marker position={[parseFloat(activeDelivery.lat), parseFloat(activeDelivery.lng)]}>
                <Popup>Mijoz: {activeDelivery.customer_id}</Popup>
              </Marker>

              {/* Yo'nalish liniyasini chizish */}
              <RoutingMachine 
                userCoords={courierCoords} 
                targetCoords={[parseFloat(activeDelivery.lat), parseFloat(activeDelivery.lng)]} 
              />
            </MapContainer>
          </div>
        </section>
      )}

      {/* --- ACTIVE DELIVERY PROFILE --- */}
      {activeDelivery ? (
        <section className="active-delivery-section">
          <div className="section-title">
            <span className="badge-live">Jonli jarayon</span>
            <h2>{activeDelivery?.city}</h2>
          </div>

          <div className="view-card">
            <div className="active-card-grid">
              <div className="delivery-main-info">
                <div className="order-meta">
                  <span className="order-id-label">ID: {activeDelivery.id}</span>
                  <span className="order-product-tag"><Package size={14} /> {activeDelivery.product} ({activeDelivery.amount} ta)</span>
                </div>
                
                <div className="info-row">
                  <MapPin size={20} className="icon-blue" />
                  <div>
                    <label>Kenglik va Uzunlik (Koordinata)</label>
                    <p className="delivery-address">{activeDelivery.lat}, {activeDelivery.lng}</p>
                  </div>
                </div>

                <div className="info-row">
                  <User size={20} className="icon-slate" />
                  <div>
                    <label>Buyurtmachi (Mijoz ID)</label>
                    <p className="delivery-customer">Mijoz kodi: #{activeDelivery.customer_id}</p>
                  </div>
                </div>
              </div>

              <div className="delivery-actions-panel">
                <a href={`tel:${activeDelivery.payment}`} className="btn-driver-secondary">
                  <Phone size={18} />
                  Mijoz bilan aloqa
                </a>
                <button className="btn-delivered-done" onClick={handleCompleteDelivery}>
                  <Check size={20} />
                  Eltib berildi (Topshirdim)
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="no-active-alert">
          <CheckCircle2 size={32} />
          <p>Hozirda faol buyurtmangiz yo'q. Quyidagi ro'yxatdan kuryerlik vazifasini tanlang.</p>
        </div>
      )}

      {/* --- AVAILABLE ORDERS POOL GRID --- */}
      <section className="pool-section">
        <div className="section-title">
          <h2>Mavjud buyurtmalar ({availableOrders.filter(o => !o.driver).length} ta)</h2>
          <p>Yetkazib berishni boshlash uchun kerakli yukni qabul qiling</p>
        </div>

        {availableOrders.filter(o => !o.driver).length === 0 ? (
          <div className="empty-pool-card">
            <p>Hozircha barcha buyurtmalar tarqatilgan. Tez orada yangi yuklar paydo bo'ladi.</p>
          </div>
        ) : (
          <div className="orders-pool-list">
            {availableOrders.filter(o => !o.driver).map((order) => (
              <div key={order?.id} className="pool-item-card">
                <div className="pool-card-header">
                  <div className="pool-id">#{order?.id}</div>
                  <div className="pool-price">{Number(order?.price).toLocaleString()} UZS</div>
                </div>

                <div className="pool-body">
                  <h4 className="pool-product">{order?.product} ({order?.amount} ta)</h4>
                  <p className="pool-address-preview">
                    <MapIcon size={14} /> {order?.city}
                  </p>
                </div>

                <button 
                  className="btn-accept-task" 
                  onClick={() => handleAcceptDelivery(order)}
                  disabled={!!activeDelivery}
                  title={activeDelivery ? "Avval joriy buyurtmani yakunlang" : "Buyurtmani olish"}
                >
                  Yukni qabul qilish
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DriverPage;