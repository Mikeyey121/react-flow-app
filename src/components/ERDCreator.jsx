import React, { useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Background,
  useReactFlow,
  ReactFlowProvider,
} from 'react-flow-renderer';

const ERDCreator = () => {
  const reactFlowInstance = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeTypes, setNodeTypes] = React.useState({});
  const [edgeTypes, setEdgeTypes] = React.useState({});

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  return (
    <div className="w-full h-screen bg-gray-900 text-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="react-flow-wrapper"
        style={{
          backgroundColor: '#0f172a',
        }}
        proOptions={{ hideAttribution: true }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background 
          color="#3b82f6"
          gap={16} 
          size={1} 
          variant="dots" 
        />
      </ReactFlow>
    </div>
  );
};

export default ERDCreator; 