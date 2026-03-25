import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import {
  checkLuckySpinValidation,
  createLuckySpin,
  fetchLuckySpinPrizes,
  getLuckySpinData,
  spinItem,
} from "../api";
import { useLocation, useNavigate } from "react-router-dom";

const Reel = ({ prizes, isSpinning, finalValue }) => {
  const [position, setPosition] = useState(0);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const itemHeight = 192;

  useEffect(() => {
    if (isSpinning) {
      const duration = 4000;
      const totalRotations = prizes.length * 5;
      const targetPosition = (totalRotations + finalValue) * itemHeight;

      startTimeRef.current = performance.now();

      const animateReel = (currentTime) => {
        const elapsedTime = currentTime - startTimeRef.current;
        const progress = Math.min(elapsedTime / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentPosition = easedProgress * targetPosition;

        setPosition(-currentPosition);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animateReel);
        }
      };

      animationFrameRef.current = requestAnimationFrame(animateReel);
    } else {
      setPosition(-finalValue * itemHeight);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpinning, finalValue, prizes.length]);

  const extendedPrizes = [...prizes, ...prizes, ...prizes, ...prizes];

  return (
    <div style={{ overflow: "hidden" }}>
      <div
        style={{
          transform: `translateY(${position}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {extendedPrizes.map((prize, index) => (
          <div
            key={index}
            style={{
              width: "12rem",
              height: "12rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#020617",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: "1rem",
              margin: "6px",
              color: "white",
            }}
          >
            <img
              src={prize.image}
              alt={prize.name}
              style={{
                width: "6rem",
                height: "6rem",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            <h3>{prize.name}</h3>
            <p style={{ color: "#22c55e" }}>{prize.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const PrizeModal = ({ prize, onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        background: "#020617",
        border: "1px solid rgba(34,197,94,0.3)",
        padding: "30px",
        borderRadius: "20px",
        textAlign: "center",
        color: "white",
        boxShadow: "0 0 25px rgba(34,197,94,0.2)",
      }}
    >
      <h2 style={{ color: "#22c55e" }}>🎉 Congratulations</h2>

      <img
        src={prize.image}
        alt={prize.name}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          margin: "15px 0",
        }}
      />

      <h3>{prize.name}</h3>
      <p style={{ color: "#22c55e" }}>{prize.value}</p>

      <button
        onClick={onClose}
        style={{
          marginTop: "15px",
          padding: "10px 25px",
          borderRadius: "20px",
          border: "none",
          background: "#22c55e",
          color: "black",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        OK
      </button>
    </div>
  </div>
);

const LuckyDraw = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state || {};

  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(0);
  const [winnings, setWinnings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [prizes, setPrizes] = useState([]);
  const [winningPrizeDetails, setWinningPrizeDetails] = useState(null);

  const fetchData = async () => {
    const data2 = await getLuckySpinData(userId);
    if (data2.success) setWinnings(data2.luckySpin?.History);

    const data = await fetchLuckySpinPrizes();
    setPrizes(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const startSpin = async () => {
    if (isSpinning) return;

    setIsSpinning(true);

    try {
      const res = await spinItem();
      const selectedItem = await res.json();

      const newResult = prizes.findIndex(
        (p) => p.name === selectedItem.itemName
      );

      setResult(newResult);

      await createLuckySpin(userId, prizes[newResult].value, prizes[newResult]);

      setWinningPrizeDetails(prizes[newResult]);
      setShowModal(true);
      fetchData();
    } catch (err) {
      console.error(err);
    }

    setIsSpinning(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 20%, rgba(34,197,94,0.15), transparent 40%), #020617",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}

     <div className="header2">
             <button className="back-btnR" onClick={() => navigate(-1)}>
               <ArrowLeft size={20} color="white" />
             </button>
     
             <h1 className="header-title">Lucky Draw</h1>
     
             <div className="header-right"></div>
           </div>

      {/* Main Card */}

      <div
        style={{
          width: "90%",
          marginTop: "20px",
          padding: "30px",
          borderRadius: "20px",
          background: "rgba(15,23,42,0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(34,197,94,0.2)",
          boxShadow: "0 0 25px rgba(34,197,94,0.15)",
        }}
      >
        {/* Slot */}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "12rem",
              height: "12rem",
              borderRadius: "20px",
              overflow: "hidden",
              border: "2px solid #22c55e",
              boxShadow: "0 0 20px rgba(34,197,94,0.4)",
            }}
          >
            <Reel prizes={prizes} isSpinning={isSpinning} finalValue={result} />
          </div>
        </div>

        {/* Spin Button */}

        <div style={{ display: "flex", justifyContent: "center", marginTop: 25 }}>
          <button
            onClick={startSpin}
            style={{
              padding: "12px 40px",
              borderRadius: "30px",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              background: "linear-gradient(90deg,#22c55e,#16a34a)",
              boxShadow: "0 0 15px rgba(34,197,94,0.4)",
            }}
          >
            {isSpinning ? "Spinning..." : "🎯 Start Spin"}
          </button>
        </div>

        {/* Rewards */}

        <h3 style={{ marginTop: "40px" }}>🎁 Rewards</h3>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {prizes.map((p, i) => (
            <div
              key={i}
              style={{
                width: "80px",
                padding: "10px",
                borderRadius: "10px",
                textAlign: "center",
                background: "#020617",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <img
                src={p.image}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                }}
              />

              <p style={{ fontSize: "12px", marginTop: "5px" }}>{p.value}</p>
            </div>
          ))}
        </div>

        {/* Winning History */}

        <h3 style={{ marginTop: "40px" }}>🏆 My Winning Record</h3>

        <div style={{ marginTop: "10px", maxHeight: "250px", overflow: "auto" }}>
          {winnings.map((win, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                marginBottom: "10px",
                background: "#020617",
                borderRadius: "10px",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <img
                src={win.data.image}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />

              <div>
                <p>{win.data.name}</p>
                <p style={{ fontSize: "12px", color: "#22c55e" }}>
                  {win.data.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && winningPrizeDetails && (
        <PrizeModal
          prize={winningPrizeDetails}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default LuckyDraw;