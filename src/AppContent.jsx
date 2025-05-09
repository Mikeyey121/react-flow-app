return (
  <div style={{ width: '100%', height: '100%' }}>
    <div
      ref={reactFlowWrapper}
      style={{
        width: '100%',
        height: '100%'
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
        style={{ background: 'white' }}
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