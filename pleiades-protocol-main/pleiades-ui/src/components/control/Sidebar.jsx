// pleiades-protocol-main/pleiades-ui/src/components/control/Sidebar.jsx

import React from 'react';
import '../../styles/control/sidebar.css'; // Importante para los estilos

// --- Componentes Visuales Definidos Directamente Aquí ---

const ThreatSummary = ({ level, nextPassage }) => (
    <div className="threat-summary">
        <h2>Nivel de Amenaza: <span className={`threat-level--${level?.toLowerCase()}`}>{level}</span></h2>
        <p>Próximo paso cercano: {nextPassage}</p>
    </div>
);

const ThreatBar = ({ percentage }) => (
    <div className="threat-bar-container">
        <div className="threat-bar" style={{ width: `${percentage}%` }}></div>
    </div>
);

const MetricCard = ({ title, value, description }) => (
    <div className="metric-card">
        <h4>{title}</h4>
        <h3>{value}</h3>
        <p>{description}</p>
    </div>
);

// --- Componente Principal del Sidebar ---

const Sidebar = () => {
    // Datos de ejemplo
    const threatData = {
        level: 'Elevado',
        nextPassage: '2029-04-13',
    };

    const impactEnergy = {
        title: 'Energía de Impacto',
        value: '4.5e+18 J',
        description: 'Equivalente a 1,000,000 de megatones',
    };
    
    const populationData = {
        title: 'Población Afectada',
        value: '1.2 Millones',
        description: 'Estimación en un radio de 100km',
    };

    return (
        <div className="sidebar-container">
            <div className='sidebar-content'>
                {/* Sección 1: Resumen de Amenaza */}
                <div className="sidebar-section">
                    <ThreatSummary level={threatData.level} nextPassage={threatData.nextPassage} />
                    <ThreatBar percentage={75} />
                </div>

                {/* Sección 2: Métricas Clave */}
                <div className="sidebar-section">
                    <h3>Métricas Clave</h3>
                    <MetricCard 
                        title={impactEnergy.title} 
                        value={impactEnergy.value} 
                        description={impactEnergy.description} 
                    />
                    <MetricCard 
                        title={populationData.title} 
                        value={populationData.value} 
                        description={populationData.description} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;