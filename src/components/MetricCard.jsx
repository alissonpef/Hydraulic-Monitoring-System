import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from './Modal';
import './MetricCard.css';

const MetricCard = ({ title, value, unit, formula, calculation, description, icon: Icon, color = '#3b82f6' }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="metric-card" style={{ borderLeftColor: color }}>
        <div className="metric-header">
          <div className="metric-icon" style={{ backgroundColor: `${color}20` }}>
            {Icon && <Icon size={24} color={color} />}
          </div>
          <div className="metric-title-container">
            <h3 className="metric-title">{title}</h3>
          </div>
        </div>

        <div className="metric-value">
          {typeof value === 'number' ? value.toFixed(2) : value} {unit}
        </div>

        <button
          className="formula-button"
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: color }}
        >
          <Plus size={18} />
          <span>Ver cálculo</span>
        </button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={title}
      >
        <div className="formula-display">
          <h3>📐 Fórmula:</h3>
          <div className="formula-math">{formula}</div>

          <h3>🧮 Cálculo:</h3>
          <div className="formula-calc">{calculation}</div>

          <div className="formula-result" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}>
            {typeof value === 'number' ? value.toFixed(2) : value} {unit}
          </div>

          {description && (
            <>
              <h3>📝 Descrição:</h3>
              <div className="formula-desc">{description}</div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default MetricCard;
