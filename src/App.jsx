import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNodes';
import CustomEdge from './CustomEdge';
import './styles/reactflow-custom.css';

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

const initialNodes = [
  { id: '1', type: 'custom', position: { x: 250, y: 5 }, data: { label: 'Start Node' } },
];

const initialEdges = [];

const AppContent = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const isConnectingRef = useRef(false);
  const reactFlowWrapper = useRef(null);

  // Add new nodes dynamically
  const handlePaneClick = useCallback(
    (event) => {
      if (isConnectingRef.current) {
        isConnectingRef.current = false;
        return;
      }

      const { top, left } = event.target.getBoundingClientRect();

      try {
        const position = screenToFlowPosition({
          x: event.clientX - left,
          y: event.clientY - top,
        });

        const newNode = {
          id: `${nodes.length + 1}`,
          type: 'custom',
          position,
          data: { label: `ERD ${nodes.length + 1}` },
        };
        setNodes((nds) => [...nds, newNode]);
      } catch (error) {
        console.error('Position calculation error:', error);
      }
    },
    [nodes, screenToFlowPosition]
  );

  // Handle connecting edges
  const onConnect = useCallback(
    (params) => {
      isConnectingRef.current = true;

      const newEdge = {
        ...params,
        type: 'custom',
        data: {
          sourceCardinality: '1..1',
          targetCardinality: '1..1',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    []
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div
        ref={reactFlowWrapper}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#111827', // Changed to a dark slate/gray (tailwind gray-900)
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={handlePaneClick}
          fitView
          className="react-flow-wrapper"
          proOptions={{ hideAttribution: true }}
          style={{
            backgroundColor: '#aaaaaa', // Matching the container background
          }}
          panOnScroll={true}
          panOnScrollSpeed={0.5}
          zoomOnScroll={false}
        >
          <Background 
            color="#3b82f6" 
            gap={16} 
            size={1} 
            variant="dots" 
          />
        </ReactFlow>
      </div>
    </div>
  );
};

const App = () => (
  <ReactFlowProvider>
    <AppContent />
  </ReactFlowProvider>
);

export default App;
