import React, { useMemo } from 'react';
import { TrendingUp, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./VIP.css";

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

const formatCurrency = (amount) => `₹${new Intl.NumberFormat('en-IN').format(amount)}`;

export const VIPBadge = ({ levelData, size = 'large', isCurrent = false, isUnlocked = true }) => {
  const ringClass = isCurrent ? 'ring-current' : isUnlocked ? 'ring-open' : 'ring-lock';
  return (
    <div className={`badge-base badge-color-${levelData.color} ${size === 'large' ? 'badge-lg' : 'badge-sm'} ${ringClass}`}>
      <span className="badge-text">{levelData.badgeText}</span>
      {size === 'large' && <span className="badge-bg-star">★</span>}
    </div>
  );
};

const VIP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state || {};
  const currentInvestment = userData?.totalAmount?.totalRechargeAmount || 0;

  const { currentLevel, nextLevel } = useMemo(() => {
    let current = VIP_LEVELS[0];
    let next = VIP_LEVELS[1];
    for (let i = VIP_LEVELS.length - 1; i >= 0; i--) {
      if (currentInvestment >= VIP_LEVELS[i].investment) {
        current = VIP_LEVELS[i];
        next = i < VIP_LEVELS.length - 1 ? VIP_LEVELS[i + 1] : null;
        break;
      }
    }
    return { currentLevel: current, nextLevel: next };
  }, [currentInvestment]);

  const progress = useMemo(() => {
    if (!nextLevel) return 100;
    const gap = nextLevel.investment - currentLevel.investment;
    const earned = currentInvestment - currentLevel.investment;
    return Math.min(100, (earned / gap) * 100);
  }, [currentInvestment, currentLevel, nextLevel]);

  return (
    <div className="vip-page-dark">
      <header className="vip-nav-header">
        <button className="back-circle" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        <h1 className="nav-title">VIP Membership</h1>
      </header>

      <div className="vip-content">
        {/* Main Status */}
        <div className="vip-main-card">
          <VIPBadge levelData={currentLevel} size="large" isCurrent={true} />
          <div className="vip-info-text">
            <span className="rank-tag">CURRENT RANK</span>
            <h2 className="rank-name">{currentLevel.name}</h2>
            <div className="inv-pill">{formatCurrency(currentInvestment)} Invested</div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="vip-surface-card">
          <div className="flex-between">
            <span className="p-title"><TrendingUp size={16} /> Progress</span>
            <span className="p-percent">{progress.toFixed(0)}%</span>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          {nextLevel && (
            <p className="p-helper">
              Invest <b>{formatCurrency(nextLevel.investment - currentInvestment)}</b> more for <b>{nextLevel.name}</b>
            </p>
          )}
        </div>

        {/* Roadmap */}
        <div className="vip-surface-card no-padding">
          <h3 className="list-title">VIP Roadmap</h3>
          {VIP_LEVELS.filter(v => v.level > 0).map((lvl) => {
            const isCurrent = lvl.level === currentLevel.level;
            const isUnlocked = currentInvestment >= lvl.investment;
            return (
              <div key={lvl.level} className={`road-item ${isCurrent ? 'active' : ''}`}>
                <div className="road-left">
                  <VIPBadge levelData={lvl} size="small" isCurrent={isCurrent} isUnlocked={isUnlocked} />
                  <span className="road-name">{lvl.name}</span>
                </div>
                <div className="road-right">
                  <span className="road-cost">{formatCurrency(lvl.investment)}</span>
                  <span className={`status-dot ${isCurrent ? 'is-now' : isUnlocked ? 'is-done' : 'is-off'}`}>
                    {isCurrent ? 'CURRENT' : isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VIP;