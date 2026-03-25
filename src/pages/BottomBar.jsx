import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiHome, HiChartBar, HiUsers, HiUserCircle } from 'react-icons/hi';

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'home', label: 'Home', path: '/home', icon: <HiHome size={24} /> },
    { id: 'invest', label: 'Invest', path: '/invest', icon: <HiChartBar size={24} /> },
    { id: 'teams', label: 'Teams', path: '/teams', icon: <HiUsers size={24} /> },
    { id: 'profile', label: 'Profile', path: '/account', icon: <HiUserCircle size={24} /> },
  ];

  // Container Styles
  const navStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '65px',
    backgroundColor: '#000000',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTop: '1px solid #eaeaea',
    boxShadow: '0 -4px 12px rgba(0,0,0,0.05)',
    zIndex: 9999,
  };

  // Individual Tab Styling Logic
  const getTabStyle = (isActive) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    cursor: 'pointer',
    color: isActive ? '#16ec3d' : '#8e8e93', // Vercel Blue for Active
    transition: 'all 0.2s ease',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    gap: '4px'
  });

  return (
    <nav style={navStyle}>
      {menuItems.map((item) => {
        // Match the logic: Is the current URL exactly the item path?
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.id}
            style={getTabStyle(isActive)}
            onClick={() => navigate(item.path)}
          >
            <div style={{ 
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s ease'
            }}>
              {item.icon}
            </div>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: isActive ? '600' : '400' 
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomBar;