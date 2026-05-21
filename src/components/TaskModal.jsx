import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEvents, CATEGORY_MAP, DEPARTMENTS } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { X, Calendar, Clock, Users, Tag, FileText } from 'lucide-react';

const selectStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '12px',
  border: '1px solid var(--border-light)', background: 'var(--bg-main)',
  fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)',
  outline: 'none', cursor: 'pointer', boxSizing: 'border-box', fontFamily: 'inherit'
};

const inputStyle = {
  ...selectStyle, cursor: 'text',
};

const labelStyle = {
  fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)',
  textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px'
};

const TaskModal = () => {
  const { isModalOpen, setIsModalOpen, addEvent, updateEvent, deleteEvent, currentEvent, activeLocation } = useEvents();
  const { currentUser } = useAuth();
  const location = useLocation();

  // Detect which calendar opened this modal
  const isWeekCalendar = location.pathname === '/tasks';
  const isMonthCalendar = location.pathname === '/calendar';

  const defaultType = isWeekCalendar ? 'task' : 'meeting';
  const defaultCategoryId = 'rnd';

  const defaultForm = {
    title: '', 
    type: defaultType,
    categoryId: defaultCategoryId,
    location: 'all',
    priority: 'medium', 
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    dueTime: '08:00', 
    duration: 1,
    sendToDepartments: [],
  };

  const [form, setForm] = useState(defaultForm);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);

  React.useEffect(() => {
    if (currentEvent) {
      setForm({
        title:      currentEvent.title      || '',
        type:       currentEvent.type       || 'task',
        categoryId: currentEvent.categoryId || 'sonl-hn',
        location:   'all',
        priority:   currentEvent.priority   || 'medium',
        status:     currentEvent.status     || 'todo',
        dueDate:    currentEvent.dueDate    || new Date().toISOString().split('T')[0],
        endDate:    currentEvent.endDate    || currentEvent.dueDate || new Date().toISOString().split('T')[0],
        dueTime:    currentEvent.dueTime    || '',
        duration:   currentEvent.duration   || 1,
        sendToDepartments: currentEvent.sendToDepartments || [],
      });
    } else {
      setForm(defaultForm);
    }
  }, [currentEvent, isModalOpen]);

  if (!isModalOpen) return null;

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const cat = CATEGORY_MAP[form.categoryId] || (DEPARTMENTS.all[0]);
    const itemData = {
      ...form,
      duration: parseFloat(form.duration),
      color: cat.color,
      text:  cat.text,
      updatedBy: currentUser ? currentUser.name : 'Unknown',
      updatedAt: new Date().toISOString(),
    };
    if (currentEvent) {
      updateEvent({ ...itemData, id: currentEvent.id });
    } else {
      addEvent(itemData);
    }
  };

  const currentCategories = DEPARTMENTS.all || [];

  const TypeIcon = form.type === 'meeting' ? Users : form.type === 'report' ? FileText : Tag;
  const typeColors = {
    meeting: { color: '#7c3aed', bg: '#f3e8ff' },
    task:    { color: '#0891b2', bg: '#e0f2fe' },
    report:  { color: '#d97706', bg: '#fef3c7' },
  };
  const tc = typeColors[form.type] || typeColors.task;
  const diffDays = form.dueDate && form.endDate 
    ? Math.max(1, Math.ceil((new Date(form.endDate) - new Date(form.dueDate)) / (1000 * 60 * 60 * 24)) + 1)
    : 1;

  return (
    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        <button
          className="btn-icon"
          style={{ position: 'absolute', top: '24px', right: '24px', width: '36px', height: '36px' }}
          onClick={() => setIsModalOpen(false)}
        >
          <X size={18} />
        </button>

        <div className="modal-header" style={{ paddingRight: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: '12px',
              background: tc.bg, color: tc.color
            }}>
              <TypeIcon size={18} />
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ margin: 0 }}>{currentEvent ? 'Edit Task' : 'Create New Task'}</h2>
              {diffDays > 1 && (
                <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--blue-accent)', background: 'var(--blue-pastel)', padding: '2px 8px', borderRadius: '8px', alignSelf: 'flex-start', marginTop: '4px' }}>
                   Range: {diffDays} days
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label style={labelStyle}>Title *</label>
            <input
              type="text" required
              placeholder="e.g. Q2 Strategy Meeting"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Type + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label style={labelStyle}>Type</label>
              {isWeekCalendar ? (
                <select value="task" disabled style={{ ...selectStyle, opacity: 0.7 }}>
                  <option value="task">✅ Task</option>
                </select>
              ) : (
                <select value={form.type} onChange={e => set('type', e.target.value)} style={selectStyle}>
                  <option value="meeting">📅 Meeting</option>
                  <option value="report">📊 Report</option>
                </select>
              )}
            </div>
            <div className="form-group">
              <label style={labelStyle}>Department</label>
              <select value={form.categoryId} onChange={e => set('categoryId', e.target.value)} style={selectStyle}>
                {currentCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          {/* Send to Departments (Only for Month Report/Meeting - Meeting / Report) */}
          {isMonthCalendar && ['meeting', 'report'].includes(form.type) && (
            <div className="form-group" style={{ marginTop: '16px', marginBottom: '16px', position: 'relative' }}>
              <label style={labelStyle}>WITH DEPARTMENTS</label>
              <div 
                style={{ ...selectStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
              >
                <span style={{ color: form.sendToDepartments.length ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: 'normal' }}>
                  {form.sendToDepartments.length ? `${form.sendToDepartments.length} departments selected` : 'Select departments...'}
                </span>
                <span style={{ fontSize: '10px' }}>{isDeptDropdownOpen ? '▲' : '▼'}</span>
              </div>
              {isDeptDropdownOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, 
                  background: 'white', border: '1px solid var(--border-light)', 
                  borderRadius: '8px', marginTop: '4px', zIndex: 10,
                  maxHeight: '180px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  {currentCategories.map(c => {
                    const isChecked = form.sendToDepartments.includes(c.id);
                    return (
                      <label key={c.id} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 12px', cursor: 'pointer',
                        borderBottom: '1px solid var(--border-light)',
                        fontSize: '14px', color: 'var(--text-primary)',
                        margin: 0
                      }}>
                        <input type="checkbox" checked={isChecked} onChange={(e) => {
                          if (e.target.checked) set('sendToDepartments', [...form.sendToDepartments, c.id]);
                          else set('sendToDepartments', form.sendToDepartments.filter(id => id !== c.id));
                        }} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                        {c.name}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Priority + Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label style={labelStyle}>Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)} style={selectStyle}>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
                <option value="low">🟢 Low</option>
              </select>
            </div>
            <div className="form-group">
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} style={selectStyle}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label style={labelStyle}><Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />DEADLINE</label>
            <input type="date" value={form.endDate} onChange={e => {
              const val = e.target.value;
              setForm(f => ({ ...f, dueDate: val, endDate: val }));
            }} style={inputStyle} />
          </div>

          {/* Time & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label style={labelStyle}><Clock size={11} style={{ display: 'inline', marginRight: 4 }} />Start Time</label>
              <input type="time" value={form.dueTime} onChange={e => set('dueTime', e.target.value)} style={inputStyle} />
            </div>
            <div className="form-group">
              <label style={labelStyle}>Duration (hours/day)</label>
              <input
                type="number" step="0.5" min="0.5" max="10"
                value={form.duration}
                onChange={e => set('duration', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="modal-footer">
            {currentEvent && (
              <button
                type="button"
                style={{ marginRight: 'auto', background: 'var(--pink-pastel)', color: 'var(--pink-accent)', padding: '10px 20px', borderRadius: '12px', border: 'none', fontWeight: '800', cursor: 'pointer' }}
                onClick={() => deleteEvent(currentEvent.id)}
              >
                Delete
              </button>
            )}
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">{currentEvent ? 'Update' : 'Add Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
