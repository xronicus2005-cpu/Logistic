import { useState } from 'react';
import '../styles/SignUp.css'; 
import { Link } from "react-router-dom";
import {toast} from "react-toastify"
import api from "../api/axios.js"
import useAuth from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    role: 'Xaridor',
    region: ''
  });

  const navigate = useNavigate()

  const { setUser } = useAuth()

  const regions = [
    "Toshkent shahri",
    "Toshkent viloyati",
    "Andijon viloyati",
    "Buxoro viloyati",
    "Fargʻona viloyati",
    "Jizzax viloyati",
    "Xorazm viloyati",
    "Namangan viloyati",
    "Navoiy viloyati",
    "Qashqadaryo viloyati",
    "Samarqand viloyati",
    "Sirdaryo viloyati",
    "Surxondaryo viloyati",
    "Qoraqalpogʻiston Respublikasi"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await api.post("/register", { formData })

      if(res.data.success){
        const me = await api.get("/me")

        if(me.data.success){
          setUser(me.data.user)
          toast.success("Tizimga kirdingiz!")

          if(me.data.user.role == "Sotuvchi"){
            navigate("/seller")
          }

          if(me.data.user.role == "Xaridor"){
            navigate("/customer")
          }

          if(me.data.user.role == "Kurer"){
            navigate("/driver")
          }
        }
        
      }
    }
    catch(err){
      toast.info("Server Bilan Bog'lanishda Xatolik")
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Ro'yxatdan o'tish</h2>
        <p className="auth-subtitle">Platformaga kirish uchun profilingizni yarating</p>

        <form onSubmit={handleSubmit} className="auth-form">
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Ism</label>
              <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Familiya</label>
              <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Elektron pochta</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="name@example.com"
              required 
            />
            <span className="input-hint">Unikal elektron pochta manzili kerak</span>
          </div>

          <div className="form-group">
            <label htmlFor="password">Parol</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Kamida 6 ta belgi" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefon raqam</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="+998" 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Rol</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                <option value="Xaridor">Xaridor</option>
                <option value="Sotuvchi">Sotuvchi</option>
                <option value="Kurer">Kurer</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="region">Hudud</label>
              <select id="region" name="region" value={formData.region} onChange={handleChange} required>
                <option value="" disabled hidden>Tanlang</option>
                {regions.map((region, index) => (
                  <option key={index} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Hisob yaratish
          </button>
        </form>

        <div className="auth-footer">
          Sizda allaqachon hisob bormi? 
          <Link to="/sign-in" className="link-to-another-page">Tizimga kirish</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;