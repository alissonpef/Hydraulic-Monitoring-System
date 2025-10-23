import React from 'react';
import './TankVisualization.css';

const TankVisualization = ({ percentage, volumeAtual, volumeTotal, altura }) => {
  const getWaveColor = () => {
    if (percentage < 30) return '#3b82f6'; // Azul
    if (percentage < 70) return '#22c55e'; // Verde
    if (percentage < 90) return '#f59e0b'; // Amarelo
    return '#ef4444'; // Vermelho
  };

  return (
    <div className="tank-container">
      <h2 className="tank-title">Visualização do Recipiente</h2>
      
      <div className="tank-wrapper">
        <div className="tank">
          <div
            className="water"
            style={{
              height: `${percentage}%`,
              backgroundColor: getWaveColor()
            }}
          >
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
          </div>
          
          {/* Marcações de nível */}
          <div className="level-marks">
            <div className="level-mark" style={{ bottom: '75%' }}>
              <span>75%</span>
            </div>
            <div className="level-mark" style={{ bottom: '50%' }}>
              <span>50%</span>
            </div>
            <div className="level-mark" style={{ bottom: '25%' }}>
              <span>25%</span>
            </div>
          </div>
        </div>

        <div className="tank-info">
          <div className="info-item">
            <span className="info-label">Nível Atual:</span>
            <span className="info-value">{percentage.toFixed(1)}%</span>
          </div>
          <div className="info-item">
            <span className="info-label">Volume:</span>
            <span className="info-value">{volumeAtual.toFixed(2)} / {volumeTotal} L</span>
          </div>
          <div className="info-item">
            <span className="info-label">Altura:</span>
            <span className="info-value">{altura.toFixed(2)} m</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TankVisualization;
