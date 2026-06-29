import React, { useState } from 'react';

// Coordinates scaled to a 400x460 container
const CITIES = {
  Patna: { name: 'Patna', x: 280, y: 170, isHub: true },
  Ranchi: { name: 'Ranchi', x: 280, y: 200, isHub: true },
  Pune: { name: 'Pune', x: 120, y: 300, isHub: true },
  Bengaluru: { name: 'Bengaluru', x: 160, y: 370, isHub: true },
  Mumbai: { name: 'Mumbai', x: 100, y: 280, isHub: true },
  Mysuru: { name: 'Mysuru', x: 145, y: 390, isHub: false },
  Delhi: { name: 'Delhi', x: 160, y: 110, isHub: true },
  Kolkata: { name: 'Kolkata', x: 320, y: 205, isHub: true },
  Chennai: { name: 'Chennai', x: 195, y: 380, isHub: true },
  Hyderabad: { name: 'Hyderabad', x: 180, y: 300, isHub: true }
};

// Simplified coordinate polygon representing India's outline for visual anchoring
const INDIA_OUTLINE_PATH = `
  M 170,25 
  L 185,50 L 180,85 L 195,95 L 225,135 L 250,135 L 290,165 
  L 310,175 L 325,155 L 340,155 L 360,140 L 390,150 L 380,180 
  L 350,190 L 330,200 L 315,200 L 320,215 L 310,230 L 270,240 
  L 240,270 L 220,300 L 210,330 L 200,370 L 165,410 L 150,435 
  L 130,400 L 120,360 L 110,320 L 100,280 L 90,260 L 90,240 
  L 75,240 L 55,230 L 70,210 L 50,190 L 50,160 L 70,130 
  L 110,80 L 140,50 Z
`;

export default function MapSimulator({ users = [], onCityClick }) {
  const [hoveredCity, setHoveredCity] = useState(null);

  // Determine active travel lines based on current locations differing from home cities
  const activeTravels = users
    .filter(user => user.homeCity && user.currentCity && user.homeCity !== user.currentCity)
    .map(user => {
      const from = CITIES[user.homeCity];
      const to = CITIES[user.currentCity];
      if (from && to) {
        // Calculate a control point for a quadratic bezier curve to make it look elegant (curved)
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        // Offset the control point perpendicular to the line to create an arc
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const offsetX = -dy * (30 / len);
        const offsetY = dx * (30 / len);
        const ctrlX = midX + offsetX;
        const ctrlY = midY + offsetY;

        return {
          id: user.id,
          userName: user.name,
          segment: user.segment,
          from,
          to,
          pathString: `M ${from.x},${from.y} Q ${ctrlX},${ctrlY} ${to.x},${to.y}`,
          midX: midX + offsetX / 2,
          midY: midY + offsetY / 2
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: '8px',
      border: '1px solid var(--card-border)',
      boxShadow: 'var(--card-shadow)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes pulseNode {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.6); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes dashTravel {
          to { stroke-dashoffset: -40; }
        }
        .pulse-ring {
          animation: pulseNode 2.5s infinite ease-in-out;
          transform-origin: center;
        }
        .travel-path {
          stroke-dasharray: 8, 4;
          animation: dashTravel 1.5s linear infinite;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Live Relocation Simulator Map</h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Click nodes to inject location signals</span>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: '380px', margin: '0 auto', background: '#0a0b10', borderRadius: '6px', border: '1px solid #1a1e2b' }}>
        <svg viewBox="0 0 400 460" width="100%" height="100%" style={{ display: 'block' }}>
          
          {/* India Boundary Visual Guide */}
          <path
            d={INDIA_OUTLINE_PATH}
            fill="#121622"
            stroke="#1f293d"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* Faint network grids grid lines to represent banking connectivity */}
          <line x1="160" y1="110" x2="280" y2="170" stroke="#1f293d" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="160" y1="110" x2="100" y2="280" stroke="#1f293d" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="100" y1="280" x2="160" y2="370" stroke="#1f293d" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="160" y1="370" x2="180" y2="300" stroke="#1f293d" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="180" y1="300" x2="280" y2="200" stroke="#1f293d" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="280" y1="170" x2="280" y2="200" stroke="#1f293d" strokeWidth="1" strokeDasharray="2,2" />
          
          {/* Active travel paths (glowing curved lines) */}
          {activeTravels.map(travel => (
            <g key={travel.id}>
              {/* Backglow line */}
              <path
                d={travel.pathString}
                fill="none"
                stroke={travel.segment === 'worker' ? 'var(--secondary-magenta)' : 'var(--primary-purple)'}
                strokeWidth="4"
                opacity="0.3"
              />
              {/* Animated dashed overlay line */}
              <path
                className="travel-path"
                d={travel.pathString}
                fill="none"
                stroke="var(--highlight-cyan)"
                strokeWidth="2"
              />
              {/* Travel direction text tag */}
              <g transform={`translate(${travel.midX}, ${travel.midY})`}>
                <rect
                  x="-45"
                  y="-10"
                  width="90"
                  height="18"
                  rx="3"
                  fill="#000000e0"
                  stroke="var(--highlight-cyan)"
                  strokeWidth="0.5"
                />
                <text
                  textAnchor="middle"
                  y="2"
                  fontSize="8"
                  fontWeight="bold"
                  fill="#ffffff"
                >
                  {travel.userName} moving
                </text>
              </g>
            </g>
          ))}

          {/* Render City Nodes */}
          {Object.entries(CITIES).map(([key, city]) => {
            // Check if there is an active relocation target here
            const isDestination = users.some(u => u.currentCity === key && u.homeCity !== key);
            const isHome = users.some(u => u.homeCity === key && u.currentCity !== key);
            
            let color = 'var(--text-secondary)';
            if (isDestination) {
              color = 'var(--highlight-cyan)';
            } else if (isHome) {
              color = 'var(--secondary-magenta)';
            } else if (city.isHub) {
              color = '#3b82f6';
            }

            return (
              <g
                key={key}
                style={{ cursor: 'pointer' }}
                onClick={() => onCityClick && onCityClick(key)}
                onMouseEnter={() => setHoveredCity(city)}
                onMouseLeave={() => setHoveredCity(null)}
              >
                {/* Outer Pulse Ring for Active Destinations */}
                {isDestination && (
                  <circle
                    className="pulse-ring"
                    cx={city.x}
                    cy={city.y}
                    r="12"
                    fill="none"
                    stroke="var(--highlight-cyan)"
                    strokeWidth="1.5"
                  />
                )}

                {/* Main Node Dot */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={city.isHub ? "6" : "4"}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* City Label */}
                <text
                  x={city.x}
                  y={city.y - 10}
                  textAnchor="middle"
                  fill={isDestination ? 'var(--highlight-cyan)' : 'var(--text-inverse)'}
                  fontSize="10"
                  fontWeight={isDestination ? 'bold' : 'normal'}
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredCity && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            right: '10px',
            background: 'rgba(10, 11, 16, 0.95)',
            border: '1px solid var(--card-border)',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: '0.75rem',
            color: 'var(--text-primary)',
            pointerEvents: 'none'
          }}>
            <strong style={{ color: 'var(--highlight-cyan)' }}>{hoveredCity.name}</strong>
            <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
              {hoveredCity.isHub ? 'Major Banking Hub' : 'Regional Branch Node'}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>
              Click node to inject relocation alert
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
