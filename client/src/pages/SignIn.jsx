import { useState } from 'react';
import '../styles/SignIn.css'; // Importing the corresponding clean style
import { Link } from "react-router-dom";
import api from "../api/axios.js"
import useAuth from"../hooks/useAuth.js"
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const {setUser} = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await api.post("/login", {formData})

      if(res.data.success){
        const me = await api.get("/me")

        if(me.data.success){
          setUser(me.data.user)
          toast.success("Tizimga kirdingiz")

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
      toast.info("Server bilan xatolik")
    }
    
    
  };

  return (
    <div className="auth-container">
      <div className="auth-card spec-sign-in">
        <h2 className="auth-title">Tizimga kirish</h2>
        <p className="auth-subtitle">Davom etish uchun profilingizga kiring</p>

        <form onSubmit={handleSubmit} className="auth-form">
          
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
          </div>

          <div className="form-group">
            <div className="label-wrapper">
              <label htmlFor="password">Parol</label>
             
            </div>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Parolingizni kiriting" 
              required 
            />
          </div>

          <button type="submit" className="btn-submit">
            Kirish
          </button>
        </form>

        <div className="auth-footer">
          Platformada yangimisiz? 
          <Link to="/" className="link-to-another-page">Ro'yxatdan o'tish</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;