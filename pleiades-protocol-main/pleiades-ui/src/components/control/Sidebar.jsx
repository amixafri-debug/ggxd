// pleiades-protocol-main/pleiades-ui/src/components/control/Sidebar.jsx

import React from 'react';
import '../../styles/control/sidebar.css';

// --- Componentes Visuales ---

const ThreatSummary = ({ level, nextPassage, objectName }) => (
    <div className="threat-summary">
        <h2>{objectName}</h2>
        <p>Nivel de Amenaza: <span className={`threat-level--${level?.toLowerCase()}`}>{level}</span></p>
        <p>Próximo paso cercano: {nextPassage}</p>
    </div>
);

const ThreatBar = ({ percentage }) => (
    <div className="threat-bar-container">
        <div className="threat-bar" style={{ width: `${percentage}%` }}></div>
    </div>
);

const MetricCard = ({ title, value, description, unit }) => (
    <div className="metric-card">
        <h4>{title}</h4>
        <div className="metric-value-container">
            <h3>{value}</h3>
            <span>{unit}</span>
        </div>
        <p>{description}</p>
    </div>
);

// NUEVO: Componente para mostrar información detallada de la composición
const ComponentInfo = ({ composition, mass }) => (
    <div className="component-info">
        <div className="info-row">
            <span>Composición:</span>
            <strong>{composition}</strong>
        </div>
        <div className="info-row">
            <span>Masa Estimada:</span>
            <strong>{mass}</strong>
        </div>
    </div>
);


// --- Componente Principal del Sidebar ---

const Sidebar = () => {
    // Datos de ejemplo más detallados
    const asteroidData = {
        name: 'Asteroide (99942) Apophis',
        threatLevel: 'Elevado',
        nextPassage: '2029-04-13',
        composition: 'Rocoso (Tipo-S)',
        estimatedMass: '2.7 x 10^10 kg'
    };

    return (
        <div className="sidebar-container">
            <div className='sidebar-content'>
                {/* Sección 1: Resumen de Amenaza */}
                <div className="sidebar-section">
                    <ThreatSummary 
                        objectName={asteroidData.name}
                        level={asteroidData.threatLevel} 
                        nextPassage={asteroidData.nextPassage} 
                    />
                    <ThreatBar percentage={85} />
                </div>

                {/* NUEVO: Sección de Propiedades Físicas */}
                <div className="sidebar-section">
                    <h3>Propiedades Físicas</h3>
                    <ComponentInfo 
                        composition={asteroidData.composition}
                        mass={asteroidData.estimatedMass}
                    />
                </div>

                {/* Sección 2: Métricas de Impacto */}
                <div className="sidebar-section">
                    <h3>Métricas de Impacto</h3>
                    <MetricCard 
                        title="Energía Cinética" 
                        value="7.5"
                        unit="x 10^18 J"
                        description="Equivalente a 1,800 megatones de TNT. Suficiente para crear un cráter de varios kilómetros." 
                    />
                    <MetricCard 
                        title="Población Afectada" 
                        value="~1.2 Millones"
                        unit="personas"
                        description="Estimación en un radio de impacto de 100km sobre una zona densamente poblada."
                    />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;