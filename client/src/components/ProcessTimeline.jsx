import React from 'react';
import './ProcessTimeline.css';

function ProcessTimeline({ currentStatus }) {
  // Definir los pasos en orden cronológico
  const steps = ['Iniciado', 'Vigente', 'En Revisión', 'Terminado'];

  // Encontrar el índice del estado actual
  const currentIndex = steps.indexOf(currentStatus);

  // Determinar el estado de cada paso
  const getStepStatus = (index) => {
    if (currentStatus === 'Cancelado' || currentStatus === 'Reparado') {
      // Estados especiales no siguen la línea de tiempo normal
      return index === 0 ? 'completed' : 'pending';
    }

    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  // Obtener icono según el estado
  const getStepIcon = (step, status) => {
    if (status === 'completed') return '✓';
    if (status === 'active') return '●';
    return '○';
  };

  return (
    <div className="timeline-wrapper">
      {/* Mensaje especial para estados fuera del flujo normal */}
      {(currentStatus === 'Cancelado' || currentStatus === 'Reparado') && (
        <div className="timeline-special-status">
          <span className={`badge badge-${currentStatus === 'Cancelado' ? 'danger' : 'warning'}`}>
            {currentStatus === 'Cancelado' ? '🚫' : '🔧'} Estado: {currentStatus}
          </span>
        </div>
      )}

      <div className="timeline-container">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step}>
              <div className="timeline-step">
                <div className={`step-indicator ${status}`}>
                  <span className="step-icon">
                    {getStepIcon(step, status)}
                  </span>
                </div>
                <div className="step-label">
                  <span className={`step-name ${status}`}>{step}</span>
                </div>
              </div>

              {/* Línea conectora entre pasos (no renderizar después del último) */}
              {!isLast && (
                <div className={`timeline-connector ${status}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ProcessTimeline;