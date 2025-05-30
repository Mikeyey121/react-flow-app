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
  const [isFontMinimized, setIsFontMinimized] = useState(false);
  const [fieldInputRefs] = useState(() => new Map());

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

  const adjustFieldFontSize = useCallback((fieldId, inputType) => {
    const input = fieldInputRefs.get(`${fieldId}-${inputType}`);
    if (!input) return false;

    let fontSize = 14; // Start with slightly smaller default for fields
    input.style.fontSize = `${fontSize}px`;

    while (input.scrollWidth > input.offsetWidth && fontSize > 8) {
      fontSize--;
      input.style.fontSize = `${fontSize}px`;
    }

    return fontSize === 8 && input.scrollWidth > input.offsetWidth;
  }, [fieldInputRefs]);

  const updateField = (id, updates) => {
    setFields(fields.map(field => {
      if (field.id === id) {
        // Only update if we're not at minimum font size or if we're deleting characters
        const currentField = fields.find(f => f.id === id);
        const inputType = Object.keys(updates)[0];
        const newValue = updates[inputType];
        
        if (inputType === 'name' || inputType === 'dataType') {
          const input = fieldInputRefs.get(`${id}-${inputType}`);
          const isAtMinFont = input && input.style.fontSize === '8px';
          
          if (isAtMinFont && newValue.length > currentField[inputType].length) {
            return field;
          }
        }
        
        return { ...field, ...updates };
      }
      return field;
    }));
  };

  const deleteField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const adjustFontSize = useCallback(() => {
    const input = titleInputRef.current;
    if (!input) return;

    // Start with the maximum font size
    let fontSize = 20;
    input.style.fontSize = `${fontSize}px`;

    // Reduce font size until text fits
    while (input.scrollWidth > input.offsetWidth && fontSize > 8) {
      fontSize--;
      input.style.fontSize = `${fontSize}px`;
    }

    // Set flag if we hit minimum font size
    setIsFontMinimized(fontSize === 8 && input.scrollWidth > input.offsetWidth);
  }, []);

  const handleTableNameChange = (e) => {
    const newValue = e.target.value;
    // Only allow the change if we're not at minimum font size
    // or if we're deleting characters
    if (!isFontMinimized || newValue.length < tableName.length) {
      setTableName(newValue);
    }
  };

  // Adjust font size when table name changes
  useEffect(() => {
    adjustFontSize();
  }, [tableName, adjustFontSize]);

  // Adjust font sizes when fields change
  useEffect(() => {
    fields.forEach(field => {
      adjustFieldFontSize(field.id, 'name');
      adjustFieldFontSize(field.id, 'dataType');
    });
  }, [fields, adjustFieldFontSize]);

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
          style={{
            textAlign: 'center',
            border: 'none',
            background: 'transparent',
            fontWeight: 'bold',
            width: '75%',
            fontSize: '20px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            minWidth: 0,
            padding: '4px'
          }}
          title={isFontMinimized ? "Maximum length reached" : tableName}
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
          <div style={{ width: '60px' }}>PK/FK</div>
          <div style={{ 
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
            <div style={{ width: '60px', display: 'flex', gap: '2px' }}>
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
              className="nodrag"
              style={{
                width: columnWidths.dataType - 8,
                border: '1px solid #ddd',
                borderRadius: '3px',
                padding: '2px 4px',
                marginRight: '4px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                fontSize: '14px'
              }}
              title={field.dataType}
            />

            {/* Delete Button */}
            <button
              onClick={() => deleteField(field.id)}
              className="nodrag"
              style={{
                padding: '4px 8px',
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
