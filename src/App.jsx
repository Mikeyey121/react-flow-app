import React, { useState, useCallback, useRef, useEffect } from 'react';
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

// Load initial state from localStorage or use defaults
const loadInitialState = () => {
  try {
    const savedNodes = localStorage.getItem('erd-nodes');
    const savedEdges = localStorage.getItem('erd-edges');
    
    const parsedNodes = savedNodes ? JSON.parse(savedNodes) : null;
    const parsedEdges = savedEdges ? JSON.parse(savedEdges) : null;
    
    // Validate the loaded data to ensure it's properly formatted
    if (parsedNodes && Array.isArray(parsedNodes) && parsedNodes.length > 0) {
      return {
        nodes: parsedNodes,
        edges: parsedEdges || []
      };
    }
  } catch (error) {
    console.error('Failed to load diagram from localStorage', error);
  }
  
  // Return default initial state if loading fails
  return {
    nodes: [
      { id: '1', type: 'custom', position: { x: 250, y: 5 }, data: { label: 'ERD 1' } },
    ],
    edges: []
  };
};

// Simple debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const AppContent = () => {
  // Load initial state from localStorage
  const initialState = loadInitialState();
  const [nodes, setNodes] = useState(initialState.nodes);
  const [edges, setEdges] = useState(initialState.edges);
  const { screenToFlowPosition } = useReactFlow();
  const isConnectingRef = useRef(false);
  const reactFlowWrapper = useRef(null);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  const latestNodesRef = useRef(nodes);
  const latestEdgesRef = useRef(edges);
  const nodeFlushersRef = useRef({});

  useEffect(() => {
    latestNodesRef.current = nodes;
    latestEdgesRef.current = edges;
  }, [nodes]);

  // Save to localStorage whenever nodes or edges change
  useEffect(() => {
    const saveToStorage = debounce(() => {
      try {
        localStorage.setItem('erd-nodes', JSON.stringify(nodes));
        localStorage.setItem('erd-edges', JSON.stringify(edges));
        console.log('ERD saved to localStorage');
      } catch (error) {
        console.error('Failed to save diagram to localStorage', error);
      }
    }, 500); // 500ms debounce to avoid excessive writes
    
    saveToStorage();
    
    return () => saveToStorage.cancel;
  }, [nodes, edges]);

  // Add new nodes dynamically
  const handlePaneClick = useCallback(
    (event) => {
      if (isConnectingRef.current) {
        isConnectingRef.current = false;
        return;
      }
  
      const { top, left } = event.target.getBoundingClientRect();
      const position = screenToFlowPosition({
        x: event.clientX - left,
        y: event.clientY - top,
      });
  
      setNodes((prevNodes) => {
        const nextId = `${prevNodes.length + 1}`;
        const newNode = {
          id: nextId,
          type: 'custom',
          position,
          data: {
            id: nextId,
            label: `ERD ${nextId}`,
            fields: [
              { id: 1, isPK: true, isFK: false, name: 'id', dataType: 'int' },
              { id: 2, isPK: false, isFK: false, name: 'name', dataType: 'varchar(255)' }
            ],
            syncNodeData, // ✅ include directly
            registerFlush: (flushFn) => {
              nodeFlushersRef.current[nextId] = flushFn; // ✅ also include directly
            },
          },
        };
        return [...prevNodes, newNode];
      });
      
    },
    [screenToFlowPosition]
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
          updateEdgeData: (id, newData) => {
            setEdges((eds) =>
              eds.map((e) =>
                e.id === id ? { ...e, data: { ...e.data, ...newData } } : e
              )
            );
          }
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

  const syncNodeData = useCallback((id, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, []);
   

  const saveNow = useCallback(() => {
    // flush all registered node changes first
    Object.values(nodeFlushersRef.current).forEach((flush) => flush());
  
    // wait for the next tick to let React flush state updates
    setTimeout(() => {
      try {
        localStorage.setItem('erd-nodes', JSON.stringify(latestNodesRef.current));
        localStorage.setItem('erd-edges', JSON.stringify(latestEdgesRef.current));
        console.log('ERD manually saved to localStorage');
  
        setShowSaveAlert(true);
        setTimeout(() => setShowSaveAlert(false), 2000);
      } catch (error) {
        console.error('Manual save failed', error);
      }
    }, 0);
  }, []);
  

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          syncNodeData,
          registerFlush: (flushFn) => {
            nodeFlushersRef.current[node.id] = flushFn;
          },
        },
      }))
    );
  }, [syncNodeData]);
  

  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          updateEdgeData: (id, newData) => {
            setEdges((currentEdges) =>
              currentEdges.map((e) =>
                e.id === id ? { ...e, data: { ...e.data, ...newData } } : e
              )
            );
          },
        },
      }))
    );
  }, []);
  

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
        <div style={{ 
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 10
        }}>
          <button
            onClick={saveNow}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: '#222',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
            
            title="Save diagram now"
          >
            Save
          </button>
        </div>
        {showSaveAlert && (
          <div style={{
            position: 'absolute',
            top: 60,
            right: 10,
            backgroundColor: '#4caf50',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: 10
          }}>
            Diagram saved!
          </div>
        )}
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
            color="#222222" 
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
