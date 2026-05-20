import React, { useState, useEffect } from 'react';
import { Plus, Users, MoreHorizontal, Edit2, Trash2, ChevronLeft } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, endOfWeek, isSameMonth } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useEvents, CATEGORY_MAP, DEPARTMENTS } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

const CATEGORY_LIST = Object.entries(CATEGORY_MAP).map(([id, v]) => ({ id, ...v }));

/* ── Main Month Calendar ── */
const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { events, openEditModal, deleteEvent, updateEvent, openAddModal, activeLocation, isEditable } = useEvents();
  const { currentUser } = useAuth();
  const canEdit = isEditable;
  
  const currentDepts = DEPARTMENTS[activeLocation] || [];

  // Active category filter
  const [activeCategories, setActiveCategories] = useState({});
  const [internalSidebarOpen, setInternalSidebarOpen] = useState(true);
  const [gridZoom, setGridZoom] = useState(240); // Initial day width in px
  const [expandedDept, setExpandedDept] = useState(null);
  const [focusedTaskId, setFocusedTaskId] = useState(null);
  const [summarySidebarOpen, setSummarySidebarOpen] = useState(true);

  const scrollToTask = (id) => {
    const el = document.getElementById(`event-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      el.classList.add('highlight-event');
      setTimeout(() => el.classList.remove('highlight-event'), 2000);
    }
  };

  const toggleFocus = (id) => {
    setFocusedTaskId(prev => prev === id ? null : id);
    if (focusedTaskId !== id) scrollToTask(id);
  };

  useEffect(() => {
    setActiveCategories(Object.fromEntries(currentDepts.map(c => [c.id, true])));
  }, [activeLocation]);

  const toggleCat = (id) => setActiveCategories(p => ({ ...p, [id]: !p[id] }));

  const editTitle = (item) => {
    const t = window.prompt('Edit title:', item.title);
    if (t && t.trim()) updateEvent({ ...item, title: t });
  };

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const monthRangeStr = format(selectedDate, 'MMMM yyyy', { locale: enUS });
  
  const handlePrevMonth = () => {
    const prev = new Date(selectedDate);
    prev.setMonth(prev.getMonth() - 1);
    setSelectedDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(selectedDate);
    next.setMonth(next.getMonth() + 1);
    setSelectedDate(next);
  };
  
  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  // Filter events to only reports & meetings (ALL statuses including Done)
  const monthEvents = events.filter(e =>
    (e.type === 'meeting' || e.type === 'report') &&
    activeCategories[e.categoryId]
  );

  return (
    <div style={{ padding: '0 40px 24px' }} className="animate-fade-in calendar-page-root">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Month Report/Meeting</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-panel)', padding: '6px 16px', borderRadius: '24px', boxShadow: 'var(--shadow-soft)', border: '1px solid var(--border-light)' }}>
            <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}><ChevronLeft size={20} /></button>
            <span style={{ fontSize: '15px', fontWeight: '800', minWidth: '130px', textAlign: 'center', color: 'var(--text-primary)' }}>{monthRangeStr}</span>
            <button onClick={handleNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}><ChevronLeft size={20} style={{ transform: 'rotate(180deg)' }} /></button>
            {format(new Date(), 'MMMM yyyy') !== monthRangeStr && (
              <button onClick={() => setSelectedDate(new Date())} style={{ background: 'var(--bg-main)', border: 'none', borderRadius: '12px', padding: '4px 10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', color: 'var(--blue-accent)' }}>Today</button>
            )}
          </div>
        </div>
      </div>

      <div className="calendar-container" style={{ display: 'flex', gap: '20px' }}>
        {/* Main Grid Scroll Area */}
        <div className="calendar-main" id="calendar-scroll-target" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 'calc(100vh - 120px)' }}>
          <div className="calendar-header-wrapper" style={{ paddingLeft: 0, marginBottom: 0 }}>
             <div className="calendar-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: 'var(--border-light)', borderTop: '1px solid var(--border-light)', borderLeft: '1px solid var(--border-light)' }}>
                {Array.from({ length: 7 }).map((_, i) => {
                  const d = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
                  const isSunday = i === 6;
                  return (
                    <div key={i} className="calendar-header-day" style={{ textAlign: 'center', padding: '10px 0', fontWeight: '800', background: 'var(--primary-accent)', color: isSunday ? '#fca5a5' : 'white', borderRight: '1px solid var(--border-light)' }}>
                      {format(d, 'EEEE', { locale: enUS })}
                    </div>
                  );
                })}
              </div>
          </div>

          <div className="calendar-body-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: `repeat(${days.length / 7}, minmax(100px, 1fr))`, gap: '1px', background: 'var(--border-light)', borderLeft: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
              {days.map((d, i) => {
                const isCurrMonth = isSameMonth(d, selectedDate);
                const isToday = isSameDay(d, new Date());
                const dayStr = format(d, 'yyyy-MM-dd');
                
                const dayEvents = monthEvents.filter(e => {
                  if (!e.dueDate) return false;
                  // Handle multi-day spans simple check
                  const d1 = new Date(e.dueDate + 'T00:00:00');
                  const d2 = new Date((e.endDate || e.dueDate) + 'T23:59:59');
                  const target = new Date(dayStr + 'T12:00:00');
                  return target >= d1 && target <= d2;
                });
                const isSunday = i % 7 === 6;
                const cellBg = isCurrMonth ? 'var(--bg-main)' : 'var(--bg-panel)';
                
                return (
                  <div key={i} onClick={() => { if(canEdit) openAddModal(); }} style={{ background: cellBg, padding: '6px', borderRight: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', opacity: isCurrMonth ? 1 : 0.6, cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-panel)'} onMouseLeave={(e) => e.currentTarget.style.background = cellBg}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ 
                        width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', 
                        background: isToday ? 'var(--primary-accent)' : 'transparent', 
                        color: isToday ? 'white' : (isSunday ? '#ef4444' : 'var(--text-primary)'),
                        fontWeight: '800',
                        fontSize: '13px'
                      }}>
                        {format(d, 'd')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
                      {dayEvents.map(e => {
                        const isMeeting = e.type === 'meeting';
                        const cat = CATEGORY_MAP[e.categoryId] || Object.values(CATEGORY_MAP)[0];
                        const isFocused = focusedTaskId === e.id;
                          const isDone = e.status === 'done';
                          return (
                           <div id={`event-${e.id}`} key={e.id} onClick={(ev) => { ev.stopPropagation(); toggleFocus(e.id); openEditModal(e); }} style={{ 
                             background: cat.accent,
                             borderLeft: `3px solid rgba(255,255,255,0.3)`,
                             color: '#ffffff',
                             padding: '4px 6px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer',
                             display: 'flex', flexDirection: 'column', gap: '2px', lineHeight: '1.3',
                             transition: 'transform 0.2s',
                             transform: isFocused ? 'scale(1.02)' : 'none',
                             boxShadow: isFocused ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                             zIndex: isFocused ? 10 : 1
                           }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800' }}>
                                <span style={{flexShrink: 0}}>{isMeeting ? '📅' : '📊'}</span>
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.dueTime} {e.title}</span>
                             </div>
                             {e.sendToDepartments && e.sendToDepartments.length > 0 && (
                               <div style={{ fontSize: '9.5px', fontWeight: '700', opacity: 0.85, marginTop: '2px', paddingLeft: '18px' }}>
                                 {e.sendToDepartments.map(id => DEPARTMENTS.all.find(dept => dept.id === id)?.name).filter(Boolean).join(', ')}
                               </div>
                             )}

                             {/* Status Badge */}
                             {(() => {
                               let badgeText = '';
                               let badgeBg = '';
                               const todayStr = new Date().toISOString().split('T')[0];
                               
                               if (e.status === 'done') {
                                 badgeText = 'Done';
                                 badgeBg = '#7c3aed';
                               } else if (e.status === 'in-progress') {
                                 badgeText = 'In progress';
                                 badgeBg = '#2563eb';
                               } else if (e.status === 'todo' && e.dueDate && e.dueDate < todayStr) {
                                 badgeText = 'Overdue';
                                 badgeBg = '#ef4444';
                               }
                               
                               if (!badgeText) return null;
                               
                               return (
                                 <div style={{
                                   backgroundColor: badgeBg,
                                   color: '#ffffff',
                                   fontSize: '8px',
                                   fontWeight: '800',
                                   padding: '1px 5px',
                                   borderRadius: '4px',
                                   alignSelf: 'flex-end',
                                   marginTop: '2px',
                                   textTransform: 'uppercase',
                                   border: '1px solid rgba(255,255,255,0.5)'
                                 }}>
                                   {badgeText}
                                 </div>
                               );
                             })()}
                           </div>
                         );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay controls removed since zoom isn't needed for month grid */}
    </div>
);
};

export default CalendarView;
