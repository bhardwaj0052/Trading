import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  User,
  Copy,
  ArrowLeft,
  AtSign,
  Phone,
  LogOut,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Wallet,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { VIPBadge } from "./VIP";
import BottomBar from "./BottomBar";

// --- Dark Theme Color Constants ---
const GREEN_GRADIENT = "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)";
const MAIN_GREEN = "#22c55e";
const SURFACE_DARK = "#1e293b"; // Slate-800
const BACKGROUND_DARK = "#0f172a"; // Slate-900
const TEXT_MUTED = "#94a3b8";

const copyToClipboard = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Failed to copy", err);
  }
  document.body.removeChild(textarea);
};

const VIP_LEVELS = [
  { level: 0, name: 'V₀', investment: 0, badgeText: 'FREE', color: 'gray' },
  { level: 1, name: 'V₁', investment: 5000, badgeText: 'V1', color: 'slate' },
  { level: 2, name: 'V₂', investment: 10000, badgeText: 'V2', color: 'amber' },
  { level: 3, name: 'V₃', investment: 15000, badgeText: 'V3', color: 'blue' },
  { level: 4, name: 'V₄', investment: 19440, badgeText: 'V4', color: 'purple' },
  { level: 5, name: 'V₅', investment: 34440, badgeText: 'V5', color: 'pink' },
  { level: 6, name: 'V₆', investment: 64440, badgeText: 'V6', color: 'emerald' },
  { level: 7, name: 'V₇', investment: 144400, badgeText: 'V7', color: 'red' },
  { level: 8, name: 'V₈', investment: 180000, badgeText: 'V8', color: 'yellow' },
];

const STYLES = `
  .app-container {
    min-height: 100vh;
    background-color: ${BACKGROUND_DARK};
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Inter', sans-serif;
    color: #f8fafc;
  }
  .mainContent { width: 100%; }
  
  .header-bg {
    height: 11rem;
    background: ${GREEN_GRADIENT};
    border-bottom-left-radius: 60% 30px;
    border-bottom-right-radius: 60% 30px;
    display: flex;
    justify-content: center;
    padding-top: 1.5rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }

  .content-padding {
    padding: 0 1.25rem 6rem 1.25rem;
    margin-top: -4.5rem;
  }

  /* Profile Card - Darker Surface */
  .profile-header-card {
    background-color: ${SURFACE_DARK};
    padding: 1.25rem;
    border-radius: 1.25rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
    border: 1px solid rgba(255,255,255,0.05);
  }

  .id-display { font-weight: 700; font-size: 1.1rem; color: #fff; }
  .copy-btn { background: none; border: none; color: ${TEXT_MUTED}; cursor: pointer; }

  /* Metrics Row */
  .balance-metrics-card {
    background: ${SURFACE_DARK};
    border-radius: 1rem;
    padding: 1.25rem;
    display: flex;
    justify-content: space-around;
    margin-bottom: 1.5rem;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .metric-item { text-align: center; }
  .m-val { display: block; font-size: 1.1rem; font-weight: 800; color: ${MAIN_GREEN}; }
  .m-lab { font-size: 0.7rem; color: ${TEXT_MUTED}; margin-top: 3px; }

  /* Financial Summary Grid */
  .section-title { font-size: 1rem; font-weight: 800; color: #cbd5e1; margin: 1.5rem 0 0.75rem 0.25rem; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  
  .summary-box {
    background: ${SURFACE_DARK};
    border-radius: 14px;
    padding: 16px;
    border: 1px solid rgba(255,255,255,0.05);
    cursor: pointer;
    transition: transform 0.2s;
  }
  .summary-box:active { transform: scale(0.97); }
  .box-label { font-size: 0.75rem; color: ${TEXT_MUTED}; display: flex; align-items: center; gap: 6px; }
  .box-value { font-size: 1.2rem; font-weight: 800; color: #fff; margin: 10px 0; }
  .box-btn {
    width: 100%;
    background: rgba(34, 197, 94, 0.15);
    color: ${MAIN_GREEN};
    border: 1px solid rgba(34, 197, 94, 0.3);
    padding: 7px;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 700;
  }

  /* Services List */
  .service-row {
    background: ${SURFACE_DARK};
    padding: 1rem;
    border-radius: 0.85rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    border: 1px solid rgba(255,255,255,0.03);
  }
  .service-info { display: flex; align-items: center; gap: 12px; font-weight: 600; color: #e2e8f0; font-size: 0.95rem; }
  .service-icon-img { width: 24px; height: 24px; filter: brightness(0.9); }

  /* Sign Out */
  .logout-button {
    width: 100%;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    padding: 1.1rem;
    border-radius: 1rem;
    color: #f87171;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 2.5rem;
  }
`;

const Profile = ({ userInfo, accountData }) => {
  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState("home");
  const [user, setUser] = useState({
    phone: userInfo?.phone || "N/A",
    userId: userInfo?.userId || "-",
    balance: userInfo?.updatedData?.balance || 0,
    totalBuy: userInfo?.updatedData?.totalBuy || 0,
    withdrawal: userInfo?.updatedData?.Withdrawal || 0,
  });

  useEffect(() => {
    setUser({
      phone: userInfo?.phone || "N/A",
      userId: userInfo?.userId || "-",
      balance: userInfo?.updatedData?.balance || 0,
      totalBuy: userInfo?.updatedData?.totalBuy || 0,
      withdrawal: userInfo?.updatedData?.Withdrawal || 0,
    });
  }, [userInfo]);

  const metrics = [
    { label: "Total Buy", value: accountData.totalBuy },
    { label: "Earnings", value: accountData.productIncome },
    { label: "Pending", value: accountData.pendingIncome },
    { label: "Orders", value: accountData.ordersCount },
  ];

  const services = [
    { name: "My Team", icon: "https://img.icons8.com/color/48/group.png", path: "/teams" },
    { name: "Account Info", icon: "https://img.icons8.com/color/48/info.png", path: "/info" },
    { name: "About Us", icon: "https://img.icons8.com/color/48/user.png", path: "/about" },
    { name: "VIP Benefits", icon: "https://img.icons8.com/color/48/vip.png", path: "/vip" },
    { name: "Trade Password", icon: "https://img.icons8.com/color/48/lock-2.png", path: "/tradepassword" },
    { name: "Login Password", icon: "https://img.icons8.com/color/48/key.png", path: "/ChangePassword" },
  ];

  const currentInvestment = userInfo?.totalAmount?.totalRechargeAmount || 0;
  let currentVIP = VIP_LEVELS.findLast(v => currentInvestment >= v.investment) || VIP_LEVELS[0];

  return (
    <div className="app-container">
      <style>{STYLES}</style>
      <div className="mainContent">
        
        {activeScreen === "home" ? (
          <>
            <div className="header-bg">
               <div style={{ background: 'rgba(255,255,255,0.1)', padding: '6px', borderRadius: '50%', height: 'fit-content', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <img src="/logo.jpg" alt="Logo" style={{ width: "2.8rem", height: "2.8rem", borderRadius: "50%" }} />
               </div>
            </div>

            <div className="content-padding">
              {/* Profile Card */}
              <div className="profile-header-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src="/avatar.jpg" alt="User" style={{ width: '58px', height: '58px', borderRadius: '50%', border: `2.5px solid ${MAIN_GREEN}`, padding: '2px' }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="id-display">{userInfo.phone}</span>
                      <button className="copy-btn" onClick={() => copyToClipboard(userInfo.userId)}><Copy size={14} /></button>
                    </div>
                    <div style={{ fontSize: '11px', color: TEXT_MUTED }}>UID: {userInfo.userId?.substring(0, 12)}</div>
                  </div>
                </div>
                <VIPBadge levelData={currentVIP} size="badge-small" isCurrent={true} />
              </div>

              {/* Metrics Row */}
              <div className="balance-metrics-card">
                {metrics.map((m, i) => (
                  <div key={i} className="metric-item">
                    <span className="m-val">{m.value >= 1000 ? (m.value/1000).toFixed(1)+'K' : m.value}</span>
                    <span className="m-lab">{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Financial Summary */}
              <h3 className="section-title">Financial Overview</h3>
              <div className="grid-2">
                <div className="summary-box" onClick={() => navigate("/RechargeHistory", { state: { data: userInfo.rechargeHistory, totalAmount: userInfo?.totalAmount?.totalRechargeAmount } })}>
                  <div className="box-label"><Wallet size={14} color={MAIN_GREEN} /> Balance</div>
                  <div className="box-value">₹{user.balance.toFixed(2)}</div>
                  <button className="box-btn">Recharge History</button>
                </div>
                <div className="summary-box" onClick={() => navigate("/orders", { state: userInfo?.withdrawHistory })}>
                  <div className="box-label"><ShoppingCart size={14} color={MAIN_GREEN} /> Orders</div>
                  <div className="box-value">{accountData.ordersCount}</div>
                  <button className="box-btn">View Orders</button>
                </div>
                <div className="summary-box" onClick={() => navigate("/orders", { state: userInfo?.withdrawHistory })}>
                  <div className="box-label"><DollarSign size={14} color={MAIN_GREEN} /> Total Assets</div>
                  <div className="box-value">₹{user.totalBuy.toFixed(2)}</div>
                  <button className="box-btn">Asset Records</button>
                </div>
                <div className="summary-box" onClick={() => navigate("/WithdrawHistory", { state: { data: userInfo?.withdrawHistory, totalAmount: userInfo?.totalAmount?.totalWithdrawAmount } })}>
                  <div className="box-label"><TrendingDown size={14} color={MAIN_GREEN} /> Withdrawn</div>
                  <div className="box-value">₹{user.withdrawal.toFixed(2)}</div>
                  <button className="box-btn">Withdraw History</button>
                </div>
              </div>

              {/* Services List */}
              <h3 className="section-title">Quick Services</h3>
              {services.map((s, i) => (
                <div key={i} className="service-row" onClick={() => navigate(s.path, { state: userInfo })}>
                  <div className="service-info">
                    <img src={s.icon} alt={s.name} className="service-icon-img" />
                    <span>{s.name}</span>
                  </div>
                  <ChevronRight size={18} color="#475569" />
                </div>
              ))}

              {/* Logout */}
              <button className="logout-button" onClick={() => {
                Cookies.remove("2ndtredingWebUser");
                localStorage.clear();
                navigate("/login");
              }}>
                <LogOut size={18} /> Log Out Account
              </button>
            </div>
          </>
        ) : (
          <div style={{ background: BACKGROUND_DARK, minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <ArrowLeft color="#fff" onClick={() => setActiveScreen("home")} />
              <h2 style={{ fontSize: '18px', color: '#fff' }}>Profile Information</h2>
            </div>
            <div style={{ marginTop: '30px', background: SURFACE_DARK, borderRadius: '12px' }}>
               <div style={{ padding: '18px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: TEXT_MUTED }}>Phone Number</span>
                  <span style={{ fontWeight: 'bold' }}>{userInfo.phone}</span>
               </div>
               <div style={{ padding: '18px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: TEXT_MUTED }}>Account UID</span>
                  <span style={{ fontWeight: 'bold' }}>{userInfo.userId}</span>
               </div>
            </div>
          </div>
        )}
      </div>
        <BottomBar />
    </div>
  );
};

export default Profile;