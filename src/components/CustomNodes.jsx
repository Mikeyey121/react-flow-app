import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Handle } from '@xyflow/react';

const CustomNode = ({ data }) => {
  const [fields, setFields] = useState(data.fields || [
    { id: 1, isPK: true, isFK: false, name: 'id', dataType: 'int' },
    { id: 2, isPK: false, isFK: false, name: 'name', dataType: 'varchar(255)' },
  ]);
  const [tableName, setTableName] = useState(data.label || 'Table Name');
  const [columnWidths, setColumnWidths] = useState({
    name: 150,
    dataType: 120
  });
  const resizingRef = useRef(null);
  const titleInputRef = useRef(null);
  const [fieldInputRefs] = useState(() => new Map());

  // Constants
  const TITLE_MAX_LENGTH = 20;
  const FIELD_MAX_LENGTH = 18;

  // Calculate dynamic width for title input
  const getTitleInputWidth = useCallback(() => {
    const baseWidth = Math.max(tableName.length * 20, 100); // 16px per character, minimum 100px
    const maxWidth = 400; // Maximum width cap
    return Math.min(baseWidth, maxWidth);
  }, [tableName]);

  const startResize = (column, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.pageX;
    const startWidth = columnWidths[column];
    
    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      moveEvent.stopPropagation();
      
      if (resizingRef.current !== column) return;
      
      const diff = moveEvent.pageX - startX;
      setColumnWidths(prev => ({
        ...prev,
        [column]: Math.max(50, startWidth + diff)
      }));
    };
    
    const handleMouseUp = () => {
      resizingRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    resizingRef.current = column;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const addField = () => {
    setFields([
      ...fields,
      { 
        id: fields.length + 1, 
        isPK: false, 
        isFK: false, 
        name: 'new_field', 
        dataType: 'varchar', 
        width: 150 
      }
    ]);
  };

  const updateField = (id, updates) => {
    setFields(fields.map(field => {
      if (field.id === id) {
        return { ...field, ...updates };
      }
      return field;
    }));
  };

  const deleteField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const handleTableNameChange = (e) => {
    const newValue = e.target.value;
    setTableName(newValue);
  };

  // Adjust font size when table name changes
  useEffect(() => {
    // No longer adjusting font size, just updating value
  }, [tableName]);

  // No longer adjusting font sizes when fields change

  return (
    <div className="erd-table" style={{ 
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      minWidth: '200px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden'
    }}>
      {/* Table Name Header */}
      <div style={{ 
        borderBottom: '2px solid #e2e8f0',
        padding: '12px 8px',
        background: '#f8fafc',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        <input
          ref={titleInputRef}
          value={tableName}
          onChange={handleTableNameChange}
          className="nodrag"
          maxLength={TITLE_MAX_LENGTH}
          style={{
            textAlign: 'center',
            border: 'none',
            background: 'transparent',
            fontWeight: 'bold',
            width: getTitleInputWidth(),
            fontSize: '20px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            minWidth: 0,
            padding: '4px'
          }}
          title={tableName}
        />
      </div>

      {/* Table Fields */}
      <div style={{ padding: '8px' }}>
        {/* Header Row */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #ddd',
          paddingBottom: '4px',
          marginBottom: '4px',
          position: 'relative'
        }}>
          <div style={{ paddingLeft: '20px', width: '60px' }}>PK/FK</div>
          <div style={{ 
            paddingLeft: '20px',
            width: columnWidths.name, 
            position: 'relative' 
          }}>
            Name
            <div
              className="resize-handle nodrag"
              onMouseDown={(e) => startResize('name', e)}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                cursor: 'col-resize',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s',
                zIndex: 1
              }}
            />
          </div>
          <div style={{ 
            paddingLeft: '15px',
            width: columnWidths.dataType,
            position: 'relative'
          }}>
            Data Type
            <div
              className="resize-handle nodrag"
              onMouseDown={(e) => startResize('dataType', e)}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '4px',
                cursor: 'col-resize',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s',
                zIndex: 1
              }}
            />
          </div>
          <div style={{ width: '30px' }}></div>
        </div>

        {fields.map((field) => (
          <div key={field.id} style={{ 
            display: 'flex',
            alignItems: 'center',
            marginBottom: '4px',
            position: 'relative'
          }}>
            {/* Target handle (left side) */}
            <Handle
              type="target"
              position="left"
              id={`${field.id}-target`}
              style={{
                background: '#555',
                width: 8,
                height: 8,
                left: -4,
                zIndex: 1000
              }}
            />

            {/* PK/FK Checkboxes */}
            <div style={{ padding: '4px 18px', width: '60px', display: 'flex', gap: '2px' }}>
              <label title="Primary Key">
                <input
                  type="checkbox"
                  checked={field.isPK}
                  onChange={(e) => updateField(field.id, { isPK: e.target.checked })}
                  className="nodrag"
                />
                PK
              </label>
              <label title="Foreign Key">
                <input
                  type="checkbox"
                  checked={field.isFK}
                  onChange={(e) => updateField(field.id, { isFK: e.target.checked })}
                  className="nodrag"
                />
                FK
              </label>
            </div>

            {/* Field Name */}
            <input
              ref={el => fieldInputRefs.set(`${field.id}-name`, el)}
              value={field.name}
              onChange={(e) => updateField(field.id, { name: e.target.value })}
              maxLength={FIELD_MAX_LENGTH}
              className="nodrag"
              style={{
                width: columnWidths.name - 8,
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '4px 8px',
                marginRight: '4px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                '&:focus': {
                  outline: 'none',
                  borderColor: '#3182ce',
                  boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.1)',
                }
              }}
              title={field.name}
            />

            {/* Data Type */}
            <input
              ref={el => fieldInputRefs.set(`${field.id}-dataType`, el)}
              value={field.dataType}
              onChange={(e) => updateField(field.id, { dataType: e.target.value })}
              maxLength={FIELD_MAX_LENGTH}
              className="nodrag"
              style={{
                width: columnWidths.name - 8,
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '4px 8px',
                marginRight: '4px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                '&:focus': {
                  outline: 'none',
                  borderColor: '#3182ce',
                  boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.1)',
                }
              }}
              title={field.dataType}
            />

            {/* Delete Button */}
            <button
              onClick={() => deleteField(field.id)}
              className="nodrag"
              style={{
                padding: '4px 8px',
                marginRight: '18px',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#dc2626',
                cursor: 'pointer',
                fontSize: '12px',
                width: '30px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: '#fecaca',
                }
              }}
              title="Delete Field"
            >
              ×
            </button>

            {/* Source handle (right side) */}
            <Handle
              type="source"
              position="right"
              id={`${field.id}-source`}
              style={{
                background: '#555',
                width: 8,
                height: 8,
                right: -4,
                zIndex: 1000
              }}
            />
          </div>
        ))}

        {/* Add Field Button */}
        <button
          onClick={addField}
          className="nodrag"
          style={{
            marginTop: '12px',
            padding: '8px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
            color: '#475569',
            transition: 'all 0.2s ease',
            '&:hover': {
              background: '#f1f5f9',
            }
          }}
        >
          + Add Field
        </button>
      </div>
    </div>
  );
};

export default CustomNode;
