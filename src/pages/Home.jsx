import CryptoJS from "crypto-js";
import Cookies from "js-cookie";
import { getUserInfo, SECRET_KEY, tokenVerify } from "../api";
import Support from "./Support";
import pako from "pako";
import PopupCard from "./PopupCard";

import React, { useEffect, useState } from "react";
import {
  Copy,
  ChevronRight,
  Gift,
  Wallet,
  TrendingUp,
  ShoppingBag,
  Zap,
  ArrowUpRight,
  Globe,
  History,
  ShieldCheck,
  Cpu,
  Activity,
  Users,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomBar from "./BottomBar";

const HomePage = () => {
  const questRewards = [
    {
      id: 1,
      text: "Inviting activation of 20",
      reward: "₹ 1600.00",
      progress: { current: 4, total: 20 },
    },
    {
      id: 2,
      text: "Inviting activation of 70",
      reward: "₹ 5000.00",
      progress: { current: 4, total: 70 },
    },
    {
      id: 3,
      text: "Inviting activation of 200",
      reward: "₹ 13000.00",
      progress: { current: 4, total: 200 },
    },
    {
      id: 4,
      text: "Inviting activation of 500",
      reward: "₹ 50000.00",
      progress: { current: 4, total: 500 },
    },
    {
      id: 5,
      text: "Inviting activation of 2000",
      reward: "₹ 180000.00",
      progress: { current: 4, total: 2000 },
    },
    {
      id: 6,
      text: "Inviting activation of 5000",
      reward: "₹ 500000.00",
      progress: { current: 4, total: 5000 },
    },
    {
      id: 7,
      text: "Inviting activation of 10000",
      reward: "₹ 1000000.00",
      progress: { current: 4, total: 10000 },
    },
  ];
  const [UserData, setUserData] = useState({});
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState("0");
  const [withdraw, setwithdraw] = useState("0");
  const [TeamSize, setTeamSize] = useState(0);
  const navigate = useNavigate();
  const fetchUser = async () => {
    const encryptedUser = Cookies.get("2ndtredingWebUser");
    const token = Cookies.get("2ndtredingWeb");
    if (encryptedUser) {
      try {
        const base64 = encryptedUser.replace(/-/g, "+").replace(/_/g, "/");

        // 🔹 3. AES decrypt (gives compressed Base64 string)
        const decryptedBase64 = CryptoJS.AES.decrypt(
          base64,
          SECRET_KEY,
        ).toString(CryptoJS.enc.Utf8);
        if (!decryptedBase64) return null;

        // 🔹 4. Convert Base64 → Uint8Array (binary bytes)
        const binaryString = atob(decryptedBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // 🔹 5. Decompress (restore JSON string)
        const decompressed = pako.inflate(bytes, { to: "string" });
        const UserData = await JSON.parse(decompressed);

        if (!UserData?._id) {
          navigate("/login");
        }
        const res1 = await tokenVerify(token, UserData?.phone);
        try {
          console.log(res1);
          if (res1.status === 200 && res1.data.success) {
            // ✅ Token valid, user data in res.data.data
          } else {
            Cookies.remove("2ndtredingWeb");
            Cookies.remove("2ndtredingWebUser");
            localStorage.removeItem("userData");
            navigate("/login");
          }
        } catch (err) {
          console.error(err);

          // 🔹 If server returns 403 → token mismatch
          if (err.response?.status === 403) {
            // Clear cookies and local storage
            Cookies.remove("2ndtredingWeb");
            Cookies.remove("2ndtredingWebUser");
            localStorage.removeItem("userData");

            // Redirect to login
            navigate("/login");
          } else {
            // Optional: handle other errors
            alert("Session expired or server error.");
          }
        }

        setUserData(UserData);

        const res = await getUserInfo(UserData._id); // fetch user info
        console.log(res?.data?.users?.team1);
        setTeamSize(res?.data?.activeCount || 0);
        setBalance(res?.data?.users?.balance || "0");
        setwithdraw(res?.data?.users?.Withdrawal || "0");
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    fetchUser();
  }, []); // ✅ empty array ensures it runs only once

  const copyLink = () => {
    const link = `http://realstateinvest.in/register?invitation_code=${UserData.referralCode}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const withdrawals = [
    {
      time: "4:44 PM",
      amount: 8623,
      status: "Withdrawal Success",
      color: "#10b981",
    },
    {
      user: "Hema",
      time: "4:38 PM",
      amount: null,
      status: "Recent Activity",
      color: "#64748b",
    },
  ];

  return (
    <div className="app-container">
      {/* Background Layer */}
      {/* <PopupCard/> */}
      <div className="cyber-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="grid-overlay"></div>
        <div className="scanline"></div>
      </div>

      {/* Header Area */}
      <header className="main-header">
        <div className="logo-section">
        
            
          <div className="logo-text">
            <h1 className="company-name">REAL STATE INVESTMENT</h1>
            <p className="system-status">SECURE CONNECTED</p>
          </div>
        </div>
      </header>

      <main className="content-wrapper">
        {/* Main Wallet Card */}
        <div className="wallet-card">
          <div className="wallet-card-glow"></div>
          <div className="wallet-info">
            <div className="info-left">
              <span className="label">Main Wallet</span>
              <h2 className="balance">
                ₹{balance}
              </h2>
            </div>
            <div className="info-icon">
              <Wallet size={24} color="#10b981" />
            </div>
          </div>
          <div className="profit-bar">
            <span className="label">Total Profit</span>
            <span className="profit-value">₹{withdraw}</span>
          </div>
          <div className="wallet-buttons">
    
            <button className="btn-primary" onClick={()=>{navigate("/recharge")}}>
              RECHARGE <ArrowUpRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() =>{console.log(" vhgv"); navigate("/withdraw")}}>WITHDRAW</button>
          </div>
        </div>

        {/* Quick Actions Grid */}
       <div className="responsive-grid">

  <div className="action-card">

    <div className="action-grid">

      <div className="action-item" onClick={() => navigate("/teams")}>
        <div className="icon-box blue">
          <Users size={24} />
        </div>

        <div className="text-box">
          <p className="title">Teams</p>
          <p className="subtitle">{TeamSize}</p>
        </div>
      </div>


      <div className="action-item" onClick={() => navigate("/orders")}>
        <div className="icon-box orange">
          <ShoppingBag size={24} />
        </div>

        <div className="text-box">
          <p className="title">Orders</p>
          <p className="subtitle">History</p>
        </div>
      </div>

    </div>

  </div>

</div>

        {/* Responsive Row for Invite and Lucky Draw */}
        <div className="responsive-flex-row">
          {/* Invitation Section */}
          <div className="card glass-card flex-grow">
            <div className="card-header">
              <h3 className="section-title">
                <TrendingUp size={18} color="#10b981" /> Invitation
              </h3>
              <span className="link-text">
                My team <ChevronRight size={14} />
              </span>
            </div>
            <div className="referral-box">
              <div className="referral-icon">
                <Users size={24} color="#10b981" />
              </div>
              <div className="referral-content">
                <p className="ref-title">Referral Program</p>
                <p className="ref-desc">
                  Invite friends and earn 15% commission.
                </p>
              </div>
            </div>
            <button className="btn-emerald-solid" onClick={copyLink}>
              <Copy size={18} />  {copied ? "Copied!" : "Copy Invitation Link"}  
            </button>
          </div>

          {/* Lucky Draw Section */}
          <div className="card lucky-draw-card flex-grow">
            <div className="lucky-grid">
              <div className="lucky-content">
                <div className="lucky-tag">PREMIUM</div>
                <h3 className="lucky-title">LUCKY DRAW</h3>
                <p className="lucky-subtitle">
                  Algorithmic wheel active. Spin for assets.
                </p>
                <button className="btn-spin" onClick={() => navigate("/luckydraw", { state: UserData?._id })}  >SPIN NOW</button>
              </div>
              <div className="lucky-visual">
                <div className="wheel-container">
                  <div className="wheel-outer-ring"></div>
                  <div className="wheel-inner-ring"></div>
                  <div className="wheel-center">
                    <Gift size={32} color="#10b981" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics and Nodes */}
        <div className="responsive-grid">
          <div className="stats-card">
            <div className="card-header">
              <h3 className="section-title">
                <Activity size={18} color="#10b981" /> Statistics
              </h3>
              <span className="live-tag">LIVE</span>
            </div>
            <div className="stats-grid">
              <div className="stat-box">
                <p className="stat-label">Total Users</p>
                <p className="stat-value">124,582</p>
              </div>
              <div className="stat-box">
                <p className="stat-label">Assets Managed</p>
                <p className="stat-value">₹14.2 L+</p>
              </div>
            </div>
          </div>

          <div className="card glass-card">
            <h3 className="section-title">
              <Cpu size={18} color="#10b981" /> Active Nodes
            </h3>
            <div className="nodes-container">
              <div className="node">
                <div className="node-dot pulse"></div> Node A-12
              </div>
              <div className="node">
                <div className="node-dot pulse delay-1"></div> Node B-04
              </div>
              <div className="node">
                <div className="node-dot pulse delay-2"></div> Node C-99
              </div>
            </div>
          </div>
        </div>

        {/* Quest Rewards Section */}
        <div className="quest-section">
          <h3 className="section-title">QUEST REWARDS</h3>
          <div className="quest-list-responsive">
            {questRewards.map((q) => {
              const progressPercentage =
                (TeamSize / q.progress.total) * 100
              return (
                <div key={q.id} className="quest-item">
                  <div className="quest-icon">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="quest-main">
                    <p className="quest-title">{q.text}</p>
                    <div className="progress-bg">
                      <div
                        className="progress-fill"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="quest-data">
                    <p className="reward-text">{q.reward}</p>
                    <p className="count-text">
                  {TeamSize}/{q.progress.total}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity */}
          <BottomBar />
      </main>

     <Support />

      <style>{`
        :root {
          --primary: #10b981;
          --bg-dark: #020504;
          --glass-bg: rgba(255, 255, 255, 0.05);
          --glass-border: rgba(255, 255, 255, 0.1);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .app-container {
          min-height: 100vh;
          background: var(--bg-dark);
          color: #e2e8f0;
          font-family: 'Inter', sans-serif;
          position: relative;
          padding-bottom: 60px;
          overflow-x: hidden;
        }
.action-card{
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 30px;
  padding: 18px;
}

.action-grid{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-item{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px;
  padding: 18px;
  border-radius: 20px;
  cursor: pointer;
  transition: 0.3s;
}

.action-item:hover{
  background: rgba(255,255,255,0.05);
}

.icon-box{
  width: 46px;
  height: 46px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box.blue{
  background: rgba(37,99,235,0.15);
  color:#3b82f6;
}

.icon-box.orange{
  background: rgba(249,115,22,0.15);
  color:#f97316;
}

.text-box{
  text-align:center;
}

.title{
  font-size:14px;
  font-weight:700;
}

.subtitle{
  font-size:11px;
  color:#64748b;
}
        /* --- Background Animations --- */
        .cyber-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
        .orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.5; animation: pulse 8s infinite alternate; }
        .orb-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: #059669; }
        .orb-2 { bottom: -10%; right: -10%; width: 400px; height: 400px; background: #2563eb; opacity: 0.3; }
        .grid-overlay {
          position: absolute; inset: 0;
          background-image: linear-gradient(to right, rgba(128,128,128,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(128,128,128,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .scanline {
          position: absolute; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent);
          top: -100px; animation: scan 10s linear infinite;
        }

        /* --- Header --- */
        .main-header { position: relative; z-index: 10; padding: 24px 5%; display: flex; justify-content: space-between; align-items: center; }
        .logo-section { display: flex; align-items: center; gap: 12px; }
         .company-name { font-size: 16px; font-weight: 900; color: #fff; margin: 0; letter-spacing: -0.5px; }
        .system-status { font-size: 9px; font-weight: 800; color: var(--primary); margin: 0; letter-spacing: 2px; }
        .header-actions { display: flex; gap: 10px; }
        .action-circle { width: 40px; height: 40px; border-radius: 50%; background: var(--glass-bg); border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; color: var(--primary); }

        /* --- Content Layout --- */
        .content-wrapper { position: relative; z-index: 10; width: 100%; padding: 0 5%; display: flex; flex-direction: column; gap: 24px; }

        /* Responsive Grids & Layouts */
        .responsive-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }

        .responsive-flex-row {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }

        .flex-grow { flex: 1 1 320px; }

        /* Wallet Card */
        .wallet-card {
          position: relative; border-radius: 40px; padding: 32px; background: rgba(0,0,0,0.4); border: 1px solid var(--glass-border);
          backdrop-filter: blur(30px); overflow: hidden;
        }
       .wallet-card-glow { 
  position: absolute; 
  inset: 0; 
  background: radial-gradient(circle at top left, rgba(16,185,129,0.2), transparent);

  pointer-events: none;   /* 🔥 THIS FIXES THE ISSUE */
} .wallet-info { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .label { font-size: 10px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
        .balance { font-size: clamp(32px, 5vw, 48px); font-weight: 700; color: #fff; margin: 4px 0 0 0; }
        .decimal { font-size: 18px; color: var(--primary); }
        .profit-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 20px; margin-bottom: 24px; }
        .profit-value { color: var(--primary); font-weight: 800; }
       .wallet-buttons { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 12px;
  position: relative;
  z-index: 2;
} 
        button { cursor: pointer; border: none; font-weight: 900; transition: 0.3s; }
        .btn-primary { background: var(--primary); color: #000; border-radius: 16px; padding: 16px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary:active { transform: scale(0.95); }
        .btn-secondary { background: var(--glass-bg); border: 1px solid var(--glass-border); color: #fff; border-radius: 16px; }

        /* Referral & Lucky Draw */
        .referral-box { display: flex; gap: 16px; align-items: center; background: rgba(0,0,0,0.2); padding: 16px; border-radius: 20px; margin-bottom: 20px; border: 1px solid var(--glass-border); }
        .referral-icon { width: 48px; height: 48px; border-radius: 14px; background: rgba(16,185,129,0.1); display: flex; align-items: center; justify-content: center; }
        .ref-title { font-size: 14px; font-weight: 700; color: #fff; }
        .ref-desc { font-size: 11px; color: #94a3b8; }
        .btn-emerald-solid { width: 100%; background: var(--primary); color: #000; padding: 16px; border-radius: 20px; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 0 20px rgba(16,185,129,0.2); }

        .lucky-draw-card { background: linear-gradient(135deg, rgba(16,185,129,0.05), rgba(37,99,235,0.05)); border: 1px solid rgba(16,185,129,0.2); padding: 0; overflow: hidden; }
        .lucky-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 0; }
        .lucky-content { padding: 24px; }
        .lucky-tag { display: inline-block; font-size: 8px; font-weight: 900; background: var(--primary); color: #000; padding: 4px 8px; border-radius: 4px; margin-bottom: 8px; }
        .lucky-title { font-size: clamp(18px, 2vw, 24px); font-weight: 900; color: #fff; margin: 0 0 8px 0; }
        .lucky-subtitle { font-size: 11px; color: #94a3b8; margin-bottom: 16px; }
        .btn-spin { background: #fff; color: #000; padding: 10px 24px; border-radius: 12px; font-size: 12px; }
        
        .lucky-visual { position: relative; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); overflow: hidden; padding: 20px; }
        .wheel-container { position: relative; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; }
        .wheel-outer-ring { position: absolute; inset: 0; border: 2px solid var(--primary); border-style: dashed; border-radius: 50%; opacity: 0.3; animation: spin 20s linear infinite; }
        .wheel-inner-ring { withdrawal-itemposition: absolute; inset: 10px; border: 3px solid var(--primary); border-radius: 50%; border-left-color: transparent; opacity: 0.6; animation: spin 4s linear infinite; }
        .wheel-center { position: absolute; width: 40px; height: 40px; background: rgba(16,185,129,0.1); border: 1px solid var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); }

        /* Action Items */
        .action-item { background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 30px; padding: 24px; display: flex; align-items: center; gap: 16px; transition: 0.3s;  }
        .icon-box { width: 52px; height: 52px; border-radius: 18px; display: flex; align-items: center; justify-content: center; }
        .icon-box.blue { background: rgba(37,99,235,0.1); color: #3b82f6; }
        .icon-box.orange { background: rgba(249,115,22,0.1); color: #f97316; }
        .title { font-size: 16px; font-weight: 700; color: #fff; }
        .subtitle { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 800; }

        /* Quest & Cards */
        .card { border-radius: 40px; padding: 24px; background: var(--glass-bg); border: 1px solid var(--glass-border); position: relative; }
        .quest-list-responsive {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 16px;
        }
        .quest-item { background: var(--glass-bg); border-radius: 30px; padding: 20px; border: 1px solid var(--glass-border); display: flex; align-items: center; gap: 16px; }
        .quest-icon { width: 48px; height: 48px; border-radius: 16px; background: #000; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .quest-main { flex: 1; }
        .quest-title { font-size: 13px; font-weight: 700; color: #fff; }
        .progress-bg { width: 100%; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; margin-top: 12px; }
        .progress-fill { height: 100%; background: var(--primary); border-radius: 2px; transition: width 0.6s ease; }
        .reward-text { font-size: 14px; font-weight: 800; color: var(--primary); white-space: nowrap; }
        .count-text { font-size: 10px; color: #64748b; text-align: right; }

        .withdrawal-list { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
        .withdrawal-item {background:var(--glass-bg); display: flex;  gap: 16px; padding-bottom: 20px; border-bottom: 1px solid var(--glass-border); }

        /* Stats Extension */
        .stats-card { background: var(--glass-bg); padding: 24px; border-radius: 40px; border: 1px solid var(--glass-border); }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 20px; }
        .stat-box { background: rgba(0,0,0,0.2); padding: 16px; border-radius: 20px; border: 1px solid var(--glass-border); }
        .stat-label { font-size: 10px; color: #64748b; font-weight: 800; }
        .stat-value { font-size: 18px; font-weight: 800; color: var(--primary); margin-top: 4px; }
        .live-tag { font-size: 8px; font-weight: 900; color: #ef4444; background: rgba(239,68,68,0.1); padding: 4px 8px; border-radius: 4px; }

        .nodes-container { display: flex; gap: 12px; margin-top: 16px; }
        .node { font-size: 10px; font-weight: 700; color: #94a3b8; display: flex; align-items: center; gap: 6px; }
        .node-dot { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; }
        .pulse { animation: dot-pulse 2s infinite; }

        /* Floating Support */
        .support-floating { position: fixed; bottom: 30px; right: 30px; z-index: 50; display: flex; flex-direction: column; align-items: center; }
        .support-wrapper { position: relative; width: 64px; height: 64px; animation: bounce 3s ease-in-out infinite; }
        .support-avatar { width: 100%; height: 100%; border-radius: 50%; background: var(--primary); border: 2px solid rgba(255,255,255,0.2); position: relative; z-index: 2; }
        .support-glow { position: absolute; inset: 0; background: var(--primary); filter: blur(15px); opacity: 0.3; }
        .online-indicator { position: absolute; top: 0; right: 0; width: 16px; height: 16px; background: var(--primary); border: 3px solid var(--bg-dark); border-radius: 50%; z-index: 3; }
        .support-label { font-size: 8px; font-weight: 900; color: var(--primary); margin-top: 8px; background: rgba(0,0,0,0.6); padding: 4px 10px; border-radius: 10px; border: 1px solid rgba(16,185,129,0.3); }

        /* Utility */
        .section-title { font-size: 16px; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .link-text { font-size: 11px; color: var(--primary); font-weight: 700; }

        /* Animations */
        @keyframes pulse { from { opacity: 0.3; } to { opacity: 0.6; } }
        @keyframes scan { from { top: -100px; } to { top: 120%; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes dot-pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        /* Mobile specific font tweaks */
        @media (max-width: 480px) {
            .lucky-grid { grid-template-columns: 1fr; }
            .lucky-visual { border-top: 1px solid var(--glass-border); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
