import React, { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';

const cardinalityOptions = ['0..1', '0..*', '1..1', '1..*'];

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style = {},
  markerEnd,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [sourceCardinality, setSourceCardinality] = useState(data?.sourceCardinality || '1');
  const [targetCardinality, setTargetCardinality] = useState(data?.targetCardinality || '1');

  const selectStyles = {
    select: {
      appearance: 'none',
      padding: '4px 30px 4px 10px',
      fontSize: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      backgroundColor: 'white',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
      color: '#1a202c',
      transition: 'all 0.2s ease',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center',
      backgroundSize: '12px',
    },
    container: {
      position: 'absolute',
      background: 'white',
      padding: '4px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      fontSize: '12px',
      pointerEvents: 'all',
      zIndex: 1000,
    },
  };

  return (
    <>
      {/* Render the bezier path using BaseEdge */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: 2,
          stroke: '#64748b',
          fill: 'none', // Necessary for bezier paths
          ...style,
        }}
        data-id={id} // Ensure React Flow can track the edge
      />

      {/* Render cardinality dropdowns */}
      <EdgeLabelRenderer>
        <div
          style={{
            ...selectStyles.container,
            transform: `translate(-50%, -50%) translate(${sourceX + 40}px,${sourceY - 20}px)`,
          }}
          className="nodrag nopan"
        >
          <select
            value={sourceCardinality}
            onChange={(e) => setSourceCardinality(e.target.value)}
            style={{
              ...selectStyles.select,
              minWidth: '80px',
            }}
          >
            {cardinalityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            ...selectStyles.container,
            transform: `translate(-50%, -50%) translate(${targetX - 40}px,${targetY - 20}px)`,
          }}
          className="nodrag nopan"
        >
          <select
            value={targetCardinality}
            onChange={(e) => setTargetCardinality(e.target.value)}
            style={{
              ...selectStyles.select,
              minWidth: '80px',
            }}
          >
            {cardinalityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
