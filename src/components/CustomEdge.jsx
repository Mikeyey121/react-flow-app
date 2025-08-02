import React, { useState } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import '../styles/custom-edge.css';

const cardinalityOptions = ['0..1', '0..*', '1..1', '1..*'];

// Frozen global constants for dropdown positioning
const DROPDOWN_HORIZONTAL_OFFSET = 60;
const DROPDOWN_VERTICAL_OFFSET = 20;

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
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

  return (
    <>
      {/* Render the bezier path using BaseEdge */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        className="custom-edge-base"
        data-id={id} // Ensure React Flow can track the edge
      />

      {/* Render cardinality dropdowns */}
      <EdgeLabelRenderer>
        <select
          value={sourceCardinality}
          onChange={(e) => setSourceCardinality(e.target.value)}
          className="custom-edge-select nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${sourceX + DROPDOWN_HORIZONTAL_OFFSET}px,${sourceY - DROPDOWN_VERTICAL_OFFSET}px)`,
          }}
        >
            {cardinalityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        <select
          value={targetCardinality}
          onChange={(e) => setTargetCardinality(e.target.value)}
          className="custom-edge-select nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${targetX - DROPDOWN_HORIZONTAL_OFFSET}px,${targetY - DROPDOWN_VERTICAL_OFFSET}px)`,
          }}
        >
            {cardinalityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
