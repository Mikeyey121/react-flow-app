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
import CustomNode from './components/CustomNodes';
import CustomEdge from './components/CustomEdge';
import Header from './components/Header';
import './styles/reactflow-custom.css';


const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

const initialNodes = [
  { id: '1', type: 'custom', position: { x: 250, y: 5 }, data: { label: 'ERD 1' } },
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
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div
        ref={reactFlowWrapper}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'white'
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
          style={{ 
            width: '100%', 
            height: '100%' 
          }}
          proOptions={{ hideAttribution: true }}
          panOnScroll={true}
          panOnScrollSpeed={0.5}
          zoomOnScroll={false}
        >
          <Background 
            color="#60a5fa" 
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
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    height: '100vh', 
    overflow: 'hidden'
  }}>
    <Header />
    <div style={{ 
      flexGrow: 1, 
      marginTop: '4rem', 
      height: 'calc(100vh - 4rem)',
      position: 'relative'
    }}>
      <ReactFlowProvider>
        <AppContent />
      </ReactFlowProvider>
    </div>
  </div>
);

export default App;
