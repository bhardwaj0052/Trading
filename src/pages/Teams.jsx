import React, { useState, useEffect } from "react";
import {  ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { getTeamOverview, SECRET_KEY } from "../api"; // Your API function & key
import "./Teams.css";
import pako from "pako";
import BottomBar from "./BottomBar";
const Teams = () => {
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState([]);
  const [activeLevel, setActiveLevel] = useState(1);
  const [totalTeams, settotalTeams] = useState(0);

  const styles = {
    appContainer: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f5f5",
      minHeight: "130vh",
      maxHeight: "130vh",
      overview: "scroll",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    header: {
      width: "100%",
      background: "linear-gradient(to bottom, #22c55e, #16a34a)", // Stronger yellow to orange gradient
      paddingTop: "20px",
      paddingBottom: "34px",
      alignItems: "center",
      textAlign: "center",
      display: "flex",
      justifyContent: "space-evenly",

      borderBottomLeftRadius: "60% 30px",
      borderBottomRightRadius: "60% 30px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      zIndex: 1,
    },
    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 20px",
      color: "#444",

      position: "relative",
      zIndex: 2,
    },
    vivoLogo: {
      width: "50px",
      height: "50px",
      backgroundColor: "white",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
    },
    bellIcon: {
      color: "#fff", // White icon for better contrast
      cursor: "pointer",
    },
    headerText: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#fff", // White text for better contrast
    },
    commissionRate: {
      fontSize: "15px",
      color: "#fff", // White text
    },
    card: {
      background: "#0f172a", // Distinct white to off-white gradient
      borderRadius: "15px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      margin: "15px 15px",
      padding: "20px",
      width: "84%",
      maxWidth: "84%",

      zIndex: 2,
    },
    cardHeader: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "#e5e7eb",
      marginBottom: "15px",
    },
    cardContent: {
      display: "flex",
      alignItems: "center",

      gap: "15px",
      overflow: "hidden",
    },
    teamInfo: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      gap: "37px",
    },
    teamDetail: {
      display: "flex",

      fontSize: "14px",
      color: "#555",
      marginBottom: "8px",
      maxWidth: "221px",
      gap: "20px",
    },
    goldImage: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    rateContainer: {
      textAlign: "center",
      marginTop: "15px",
    },
    rateValue: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#22c55e",
    },
    rateLabel: {
      fontSize: "12px",
      color: "#666",
    },
    arrowIcon: {
      color: "#bbb",
      cursor: "pointer",
      alignSelf: "center",
    },
    coloredValue: {
      color: "#22c55e", // Yellow color for the values
      fontWeight: "bold",
    },
  };

  useEffect(() => {
    const fetchUserTeam = async () => {
      const encryptedUser = Cookies.get("2ndtredingWebUser");
      if (!encryptedUser) return navigate("/login");

      const base64 = encryptedUser.replace(/-/g, "+").replace(/_/g, "/");

      // 🔹 3. AES decrypt (gives compressed Base64 string)
      const decryptedBase64 = CryptoJS.AES.decrypt(base64, SECRET_KEY).toString(
        CryptoJS.enc.Utf8
      );
      if (!decryptedBase64) return null;

      // 🔹 4. Convert Base64 → Uint8Array (binary bytes)
      const binaryString = atob(decryptedBase64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 🔹 5. Decompress (restore JSON string)
      const decompressed = pako.inflate(bytes, { to: "string" });
      const userData = await JSON.parse(decompressed);
      if (!userData?._id) return navigate("/login");

      const res = await getTeamOverview(userData._id);
      console.log(res.success);
      const levels = [1, 2, 3];
      const teamResults = levels.map((level) => {
        const teamKey = `team${level}`;
        const team = res.success ? res?.overview[teamKey] || {} : {};
        settotalTeams(res?.overview?.totalTeams);
        return {
          level,
          userid: userData?._id,
          totalRecharge: team.totalRecharge || 0,
          myCommission: team.totalCommission || 0,

          commissionRate: team.commissionRate
            ? `${team.commissionRate}%`
            : "0%",
          path:
            level === 1
              ? "/teamonelevel"
              : level === 2
                ? "/teamtwolevel"
                : "/teamthreelevel",
        };
      });

      setTeamData(teamResults);
    };

    fetchUserTeam();
  }, [navigate]);

 

  return (
    <div className="teams-container">
      {/* Header */}
      <div className="team-header">


        <div className="team-title">Team</div>

        <div className="team-count">
          Total: {totalTeams}
        </div>

      </div>
      <div className="team-stats">

        <div className="stat-box">
          <span>₹ {teamData?.[0]?.myCommission || 0}</span>
          <p>Earnings</p>
        </div>

        <div className="stat-box">
          <span>{totalTeams}</span>
          <p>Total Team</p>
        </div>

        <div className="stat-box">
          <span>{teamData?.[0]?.totalRecharge || 0}</span>
          <p>Directs</p>
        </div>

      </div>
      <div className="level-tabs">
        {[1, 2, 3].map((lvl) => (
          <div
            key={lvl}
            className={`level-tab ${activeLevel === lvl ? "active" : ""}`}
            onClick={() => setActiveLevel(lvl)}
          >
            LEVEL {lvl}
          </div>
        ))}
      </div>

      {/* Team Cards */}
      <div className="level-content">
        {teamData
          .filter((team) => team.level === activeLevel)
          .map((team, index) => (
            <div
              key={index}
              className="team-card animate"
              onClick={() =>
                navigate(team.path, {
                  state: { userid: team.userid, level: team.level },
                })
              }
            >
              <div style={styles.cardHeader}>Level {team.level} Teams</div>
              <div style={styles.cardContent}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      ...styles.goldImage,
                      backgroundImage: "url('https://img.freepik.com/free-vector/gradient-gold-coin_78370-4508.jpg')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "hue-rotate(120deg) saturate(.5)"
                    }}
                  ></div>
                  <div style={styles.rateContainer}>
                    <div style={styles.rateValue}>{team.level === 1 ? "25" : team.level === 2 ? "8" : "2"}</div>
                    <div style={styles.rateLabel}>Commission Rate</div>
                  </div>
                </div>

                <div style={styles.teamInfo}>
                  <div style={styles.teamDetail}>
                    <span>Total Recharge:</span>
                    <span style={styles.coloredValue}>₹ {team.totalRecharge}</span>
                  </div>
                  <div style={styles.teamDetail}>
                    <span>My Commission:</span>
                    <span style={styles.coloredValue}>₹ {team.myCommission}</span>
                  </div>
                </div>

                <ChevronRight style={styles.arrowIcon} />
              </div>
            </div>
          ))}
      </div>

      {/* Bottom Navigation */}
     
      <BottomBar />
    </div>
  );
};

export default Teams;
