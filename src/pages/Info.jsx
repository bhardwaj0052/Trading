import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Phone, Clipboard, CalendarDays, Copy, ArrowLeft, User } from "lucide-react";

// --- Theme Constants ---
const GREEN_GRADIENT = "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)";
const MAIN_GREEN = "#22c55e";
const SURFACE_DARK = "#1e293b"; 
const BACKGROUND_DARK = "#0f172a";

const STYLES = `
  .info-container {
    min-height: 100vh;
    background-color: ${BACKGROUND_DARK};
    color: #f8fafc;
    font-family: 'Inter', sans-serif;
  }
  .info-header-v2 {
    background: ${GREEN_GRADIENT};
    padding: 20px 20px 60px 20px;
    border-bottom-left-radius: 40px;
    border-bottom-right-radius: 40px;
    position: relative;
    text-align: center;
  }
  .back-btn-circle {
    position: absolute;
    left: 20px;
    top: 20px;
    background: rgba(255,255,255,0.2);
    border: none;
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
    color: white;
  }
  .avatar-wrapper {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .avatar-img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 4px solid rgba(255,255,255,0.3);
    object-fit: cover;
  }
  .member-since {
    margin-top: 12px;
    font-size: 13px;
    opacity: 0.9;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .details-section {
    padding: 20px;
    margin-top: -30px;
  }
  .info-card-dark {
    background: ${SURFACE_DARK};
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.05);
  }
  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .detail-row:last-child { border-bottom: none; }
  .label-group {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #94a3b8;
    font-size: 14px;
  }
  .value-group {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #fff;
    font-weight: 600;
  }
  .copy-icon-btn {
    background: none;
    border: none;
    color: ${MAIN_GREEN};
    cursor: pointer;
    padding: 4px;
  }
  .toast-copy {
    font-size: 10px;
    color: ${MAIN_GREEN};
    margin-left: 4px;
  }
  h2.section-title {
    font-size: 16px;
    margin-bottom: 15px;
    color: #cbd5e1;
    padding-left: 5px;
  }
`;

function Info() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state || {};
  const [copiedKey, setCopiedKey] = useState(null);

  const [user, setUser] = useState({
    phone: "N/A",
    userId: "-",
    referralCode: "-",
    registrationDate: new Date(),
  });

  useEffect(() => {
    if (userData) {
      setUser({
        phone: userData?.phone || "N/A",
        userId: userData?.userId || "-",
        referralCode: userData?.UserData?.referralCode || "-",
        registrationDate: userData?.UserData?.registrationDate || new Date(),
      });
    }
  }, [userData]);

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="info-container">
      <style>{STYLES}</style>
      
      <header className="info-header-v2">
        <button className="back-btn-circle" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        
        <div className="avatar-wrapper">
          <img src="/avatar.jpg" alt="Profile" className="avatar-img" />
          <p className="member-since">
            <CalendarDays size={14} /> Member Since: {new Date(user.registrationDate).toLocaleDateString()}
          </p>
        </div>
      </header>

      <main className="details-section">
        <h2 className="section-title">Account Information</h2>
        
        <div className="info-card-dark">
          {/* User ID Row */}
          <div className="detail-row">
            <div className="label-group">
              <User size={18} />
              <span>User ID</span>
            </div>
            <div className="value-group">
              <span>{user.userId}</span>
              <button className="copy-icon-btn" onClick={() => handleCopy(user.userId, "userId")}>
                <Copy size={14} />
                {copiedKey === "userId" && <span className="toast-copy">Copied!</span>}
              </button>
            </div>
          </div>

          {/* Phone Row */}
          <div className="detail-row">
            <div className="label-group">
              <Phone size={18} />
              <span>Phone Number</span>
            </div>
            <div className="value-group">
              <span>{user.phone}</span>
            </div>
          </div>

          {/* Referral Row */}
          <div className="detail-row">
            <div className="label-group">
              <Clipboard size={18} />
              <span>Referral Code</span>
            </div>
            <div className="value-group">
              <span>{user.referralCode}</span>
              <button className="copy-icon-btn" onClick={() => handleCopy(user.referralCode, "ref")}>
                <Copy size={14} />
                {copiedKey === "ref" && <span className="toast-copy">Copied!</span>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Info;