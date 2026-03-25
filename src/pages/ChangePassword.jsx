import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Smartphone, ShieldCheck, ChevronRight } from "lucide-react";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../api";

const MAIN_GREEN = "#22c55e";
const SURFACE_DARK = "#1e293b"; 
const BACKGROUND_DARK = "#0f172a"; 

const STYLES = `
  .auth-page {
    min-height: 100vh;
    background: radial-gradient(circle at top right, #1e293b, ${BACKGROUND_DARK});
    font-family: 'Inter', sans-serif;
    color: #f8fafc;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  .nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
  }

  .back-btn-blur {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 10px;
    color: white;
    cursor: pointer;
  }

  .page-title-group h1 {
    font-size: 24px;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(to right, #fff, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .page-title-group p {
    font-size: 13px;
    color: #94a3b8;
    margin-top: 4px;
  }

  .form-container {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  }

  .input-wrapper {
    margin-bottom: 20px;
    position: relative;
  }

  .input-wrapper label {
    display: block;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
    margin-bottom: 8px;
    margin-left: 4px;
  }

  .field-box {
    position: relative;
    display: flex;
    align-items: center;
  }

  .field-icon {
    position: absolute;
    left: 16px;
    color: ${MAIN_GREEN};
    opacity: 0.8;
  }

  .auth-input {
    width: 100%;
    background: rgba(15, 23, 42, 0.6);
    border: 1px solid #334155;
    padding: 14px 16px 14px 48px;
    border-radius: 14px;
    color: white;
    font-size: 15px;
    outline: none;
    transition: all 0.3s ease;
  }

  .auth-input:focus {
    border-color: ${MAIN_GREEN};
    background: rgba(15, 23, 42, 0.9);
    box-shadow: 0 0 15px rgba(34, 197, 94, 0.1);
  }

  .eye-toggle {
    position: absolute;
    right: 16px;
    color: #475569;
    cursor: pointer;
  }

  .action-btn {
    width: 100%;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white;
    border: none;
    padding: 16px;
    border-radius: 16px;
    font-weight: 700;
    font-size: 16px;
    margin-top: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 10px 20px rgba(22, 163, 74, 0.2);
    transition: transform 0.2s;
  }

  .action-btn:active {
    transform: scale(0.98);
  }

  .action-btn:disabled {
    opacity: 0.5;
    filter: grayscale(1);
  }

  .security-tip {
    margin-top: 30px;
    padding: 16px;
    border-radius: 16px;
    background: rgba(34, 197, 94, 0.05);
    border: 1px solid rgba(34, 197, 94, 0.1);
    display: flex;
    gap: 12px;
  }

  .tip-text h4 {
    font-size: 14px;
    color: ${MAIN_GREEN};
    margin: 0 0 4px 0;
  }

  .tip-text p {
    font-size: 12px;
    color: #94a3b8;
    margin: 0;
    line-height: 1.4;
  }
`;

function ChangePassword() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !currentPassword || !newPassword) return alert("Please fill all fields");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}api/users/Change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          type: "password",
          currentPassword,
          confirmPassword: newPassword,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Success! Re-login required.");
        Cookies.remove("2ndtredingWeb");
        localStorage.clear();
        navigate("/login");
      } else {
        alert(data.message || "Failed to update");
      }
    } catch (err) {
      alert("Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <style>{STYLES}</style>

      <div className="nav-bar">
        <button className="back-btn-blur" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="page-title-group">
        <h1>Update Security</h1>
        <p>Change your login password to keep your assets safe.</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <form className="form-container" onSubmit={handleSubmit}>
          
          <div className="input-wrapper">
            <label>Phone Number</label>
            <div className="field-box">
              <Smartphone size={18} className="field-icon" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="00000 00000"
                className="auth-input"
              />
            </div>
          </div>

          <div className="input-wrapper">
            <label>Current Password</label>
            <div className="field-box">
              <Lock size={18} className="field-icon" />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="auth-input"
              />
              <div className="eye-toggle" onClick={() => setShowCurrent(!showCurrent)}>
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <div className="input-wrapper">
            <label>New Password</label>
            <div className="field-box">
              <ShieldCheck size={18} className="field-icon" />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create new password"
                className="auth-input"
              />
              <div className="eye-toggle" onClick={() => setShowNew(!showNew)}>
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <button type="submit" className="action-btn" disabled={loading}>
            {loading ? "Processing..." : "Secure Update"}
            {!loading && <ChevronRight size={18} />}
          </button>
        </form>
      </div>

      <div className="security-tip">
        <ShieldCheck size={24} color={MAIN_GREEN} />
        <div className="tip-text">
          <h4>Security Tip</h4>
          <p>Use a combination of letters, numbers, and symbols. Avoid using the same password across multiple sites.</p>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;