import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, ShieldCheck, Smartphone, Lock, Check } from "lucide-react";
import { API_BASE_URL, sendOtp } from "../api";
import "./TradePassword.css";

function TradePassword() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const [tradePassword, setTradePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showTradePass, setShowTradePass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async () => {
    if (!phone) return alert("Please enter phone number");
    setLoading(true);
    try {
      const data = await sendOtp(phone);
      if (data.success) {
        setOtpSent(true);
        setGeneratedOtp(data?.data?.otp || "123456");
        setTimer(60);
        alert("OTP sent successfully!");
      } else {
        alert(data?.data?.data?.message[0] || "Failed to send OTP");
      }
    } catch (err) {
      alert("Error sending OTP");
    }
    setLoading(false);
  };

  const handleVerifyOtp = () => {
    if (!otp) return alert("Enter OTP");
    if (otp == generatedOtp) {
      setOtpVerified(true);
    } else {
      alert("Invalid OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tradePassword !== confirmPassword) return alert("Passwords do not match!");
    try {
      const res = await fetch(`${API_BASE_URL}api/users/Change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, type: "tradePassword", confirmPassword }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Trade Password updated successfully!");
        navigate(-1);
      } else {
        alert(data.message || "Failed to update");
      }
    } catch (err) {
      alert("Error updating Trade Password");
    }
  };

  // Determine current step for the UI
  const currentStep = otpVerified ? 3 : otpSent ? 2 : 1;

  return (
    <div className="tp-new-wrapper">
      <header className="tp-new-header">
        <button className="tp-back-circle" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className="tp-step-indicator">
          <div className={`step-dot ${currentStep >= 1 ? "active" : ""}`}>{currentStep > 1 ? <Check size={12}/> : 1}</div>
          <div className={`step-line ${currentStep >= 2 ? "active" : ""}`}></div>
          <div className={`step-dot ${currentStep >= 2 ? "active" : ""}`}>{currentStep > 2 ? <Check size={12}/> : 2}</div>
          <div className={`step-line ${currentStep >= 3 ? "active" : ""}`}></div>
          <div className={`step-dot ${currentStep >= 3 ? "active" : ""}`}>3</div>
        </div>
      </header>

      <div className="tp-new-content">
        <div className="tp-glass-card">
          <div className="tp-icon-section">
             <div className="tp-icon-bg">
                {currentStep === 1 && <Smartphone size={32} color="#22c55e" />}
                {currentStep === 2 && <ShieldCheck size={32} color="#22c55e" />}
                {currentStep === 3 && <Lock size={32} color="#22c55e" />}
             </div>
             <h2>{currentStep === 1 ? "Verify Phone" : currentStep === 2 ? "Enter OTP" : "Set Password"}</h2>
             <p>{currentStep === 1 ? "Confirm your number to receive security code" : currentStep === 2 ? `Enter the code sent to ${phone}` : "Create a new secure trade password"}</p>
          </div>

          <form onSubmit={handleSubmit} className="tp-form">
            {currentStep === 1 && (
              <div className="tp-input-wrap">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="tp-main-input"
                  required
                />
                <button type="button" className="tp-submit-btn" onClick={handleSendOtp} disabled={loading}>
                  {loading ? "Sending..." : "Send Verification Code"}
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="tp-input-wrap">
                <input
                  type="tel"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-Digit OTP"
                  className="tp-main-input"
                  required
                />
                <button type="button" className="tp-submit-btn" onClick={handleVerifyOtp}>
                  Verify OTP
                </button>
                {timer > 0 ? <p className="resend-text">Resend in {timer}s</p> : <button type="button" className="resend-btn" onClick={handleSendOtp}>Resend Code</button>}
              </div>
            )}

            {currentStep === 3 && (
              <div className="tp-input-wrap">
                <div className="tp-pass-field">
                  <input
                    type={showTradePass ? "text" : "password"}
                    value={tradePassword}
                    onChange={(e) => setTradePassword(e.target.value)}
                    placeholder="New Trade Password"
                    className="tp-main-input"
                    required
                  />
                  <span className="tp-eye" onClick={() => setShowTradePass(!showTradePass)}>
                    {showTradePass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>

                <div className="tp-pass-field">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Trade Password"
                    className="tp-main-input"
                    required
                  />
                  <span className="tp-eye" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>

                <button type="submit" className="tp-submit-btn" disabled={!tradePassword || tradePassword !== confirmPassword}>
                  Update Trade Password
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="tp-security-footer">
           <ShieldCheck size={16} color="#22c55e" />
           <span>Secure SSL Encrypted Transaction</span>
        </div>
      </div>
    </div>
  );
}

export default TradePassword;