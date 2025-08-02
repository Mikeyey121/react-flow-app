import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Handle } from '@xyflow/react';
import '../styles/custom-nodes.css';

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

  useEffect(() => {
    if (data.syncNodeData && data.id) {
      data.syncNodeData(data.id, { label: tableName });
    }
  }, [tableName]);

  useEffect(() => {
    if (data.syncNodeData && data.id) {
      data.syncNodeData(data.id, { fields });
    }
  }, [fields]);
  

  return (
    <div className="erd-table">
      {/* Table Name Header */}
      <div className="erd-table-header">
        <input
          ref={titleInputRef}
          value={tableName}
          onChange={handleTableNameChange}
          className="erd-table-title-input nodrag"
          maxLength={TITLE_MAX_LENGTH}
          style={{
            width: getTitleInputWidth(),
          }}
          title={tableName}
        />
      </div>

      {/* Table Fields */}
      <div className="erd-table-fields">
        {/* Header Row */}
        <div className="erd-table-header-row">
          <div className="erd-table-pkfk-header">PK/FK</div>
          <div 
            className="erd-table-name-header"
            style={{ width: columnWidths.name }}
          >
            Name
            <div
              className="resize-handle nodrag"
              onMouseDown={(e) => startResize('name', e)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div 
            className="erd-table-datatype-header"
            style={{ width: columnWidths.dataType }}
          >
            Data Type
            <div
              className="resize-handle nodrag"
              onMouseDown={(e) => startResize('dataType', e)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="erd-table-actions-header"></div>
        </div>

        {fields.map((field) => (
          <div key={field.id} className="erd-table-field-row">
            {/* Target handle (left side) */}
            <Handle
              type="target"
              position="left"
              id={`${field.id}-target`}
            />

            {/* PK/FK Checkboxes */}
            <div className="erd-table-checkboxes">
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
              onChange={(e) => {
                e.stopPropagation();
                updateField(field.id, { name: e.target.value });
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onKeyUp={(e) => e.stopPropagation()}
              maxLength={FIELD_MAX_LENGTH}
              className="erd-table-field-input nodrag"
              style={{
                width: columnWidths.name - 8,
              }}
              title={field.name}
            />

            {/* Data Type */}
            <input
              ref={el => fieldInputRefs.set(`${field.id}-dataType`, el)}
              value={field.dataType}
              onChange={(e) => {
                e.stopPropagation();
                updateField(field.id, { dataType: e.target.value });
              }}
              onKeyDown={(e) => e.stopPropagation()}
              onKeyUp={(e) => e.stopPropagation()}
              maxLength={FIELD_MAX_LENGTH}
              className="erd-table-field-input nodrag"
              style={{
                width: columnWidths.name - 8,
              }}
              title={field.dataType}
            />

            {/* Delete Button */}
            <button
              onClick={() => deleteField(field.id)}
              className="erd-table-delete-button nodrag"
              title="Delete Field"
            >
              ×
            </button>

            {/* Source handle (right side) */}
            <Handle
              type="source"
              position="right"
              id={`${field.id}-source`}
            />
          </div>
        ))}

        {/* Add Field Button */}
        <button
          onClick={addField}
          className="erd-table-add-button nodrag"
        >
          + Add Field
        </button>
      </div>
    </div>
  );
};

export default CustomNode;
