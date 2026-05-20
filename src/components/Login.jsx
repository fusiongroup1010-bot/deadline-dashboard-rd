import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, Building2 } from 'lucide-react';
import logo from '../assets/fusion-logo.png';

const DEPT_LOGINS = [
  { id: 'rnd', name: 'Phòng R&D', displayNames: ['Trà', 'Thanh', 'Nam'] },
  { id: 'sale-online', name: 'Phòng Sale Online', displayNames: ['Thảo', 'CRM1', 'CRM2'] },
  { id: 'mms', name: 'Phòng MMS', displayNames: ['Lan Anh', 'Trang'] },
  { id: 'logistics', name: 'Phòng Logistics', displayNames: ['Log Admin'] },
  { id: 'design', name: 'Phòng Design', displayNames: ['Design Admin', 'Designer'] }
];

const Login = () => {
  const [loginMode, setLoginMode] = useState('dept'); // 'dept' or 'id'
  const [selectedDeptId, setSelectedDeptId] = useState('rnd');
  const [selectedName, setSelectedName] = useState('');
  const [deptPassword, setDeptPassword] = useState('FS1234');
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberId, setRememberId] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Set default name when department changes
  useEffect(() => {
    const dept = DEPT_LOGINS.find(d => d.id === selectedDeptId);
    if (dept && dept.displayNames.length > 0) {
      setSelectedName(dept.displayNames[0]);
    }
  }, [selectedDeptId]);

  useEffect(() => {
    const savedId = localStorage.getItem('rememberedId');
    if (savedId) {
      setUserId(savedId);
      setRememberId(true);
    }
  }, []);

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      if (loginMode === 'dept') {
        // Department Login
        await login(selectedDeptId, deptPassword, selectedName);
      } else {
        // Traditional ID Login
        await login(userId, password);
        if (rememberId && userId.toLowerCase() !== 'guest') {
          localStorage.setItem('rememberedId', userId);
        } else {
          localStorage.removeItem('rememberedId');
        }
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Incorrect credentials or access denied.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}>
      <div className="login-card animate-fade-in" style={{ boxShadow: '0 20px 40px rgba(34, 197, 94, 0.08)', borderRadius: '24px', border: '1px solid var(--border-light)' }}>
        <div className="login-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img 
            src={logo} 
            alt="Fusion Group Logo" 
            style={{ width: '110px', height: 'auto', marginBottom: '16px' }} 
          />
          <h1 className="text-gradient" style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1.2', background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>RNDSP Deadline Management</h1>
          <p className="login-subtitle" style={{ fontSize: '15px', fontWeight: '700', marginTop: '8px', color: 'var(--text-secondary)' }}>Hệ thống Quản lý Tiến độ R&D</p>
        </div>

        {/* Tab Selector */}
        <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '4px', borderRadius: '14px', margin: '24px 0 20px 0', border: '1px solid var(--border-light)' }}>
          <button
            type="button"
            onClick={() => { setLoginMode('dept'); setError(''); }}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: '10px', border: 'none',
              background: loginMode === 'dept' ? 'var(--primary-accent)' : 'transparent',
              color: loginMode === 'dept' ? 'white' : 'var(--text-secondary)',
              fontSize: '13px', fontWeight: '800', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Building2 size={16} />
            Đăng nhập Phòng Ban
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode('id'); setError(''); }}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: '10px', border: 'none',
              background: loginMode === 'id' ? 'var(--primary-accent)' : 'transparent',
              color: loginMode === 'id' ? 'white' : 'var(--text-secondary)',
              fontSize: '13px', fontWeight: '800', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Shield size={16} />
            Đăng nhập Mã ID
          </button>
        </div>

        {error && <div className="login-error" style={{ marginBottom: '16px', padding: '10px 16px', borderRadius: '10px' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {loginMode === 'dept' ? (
            /* Department login fields */
            <>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>Chọn phòng ban</label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '15px', fontWeight: '700', background: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none' }}
                >
                  {DEPT_LOGINS.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>Tên thành viên hiển thị</label>
                <select
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '15px', fontWeight: '700', background: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none' }}
                >
                  {DEPT_LOGINS.find(d => d.id === selectedDeptId)?.displayNames.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>Mật khẩu đăng nhập</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={deptPassword}
                    onChange={(e) => setDeptPassword(e.target.value)}
                    required
                    placeholder="Nhập mật khẩu"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '15px', background: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', padding: '4px', cursor: 'pointer',
                      color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Traditional ID-based login fields */
            <>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label htmlFor="userId" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>Mã nhân sự (Employee ID)</label>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                  placeholder="Ví dụ: TrangSamFS, LeLienFS..."
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '15px', background: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label htmlFor="password" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px', display: 'block' }}>Mật khẩu (Password)</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Nhập mật khẩu của bạn"
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-light)', fontFamily: 'inherit', fontSize: '15px', background: 'var(--bg-main)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', padding: '4px', cursor: 'pointer',
                      color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <input 
                  type="checkbox" 
                  id="remember" 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  checked={rememberId}
                  onChange={(e) => setRememberId(e.target.checked)}
                />
                <label htmlFor="remember" style={{ margin: 0, cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}>Ghi nhớ ID của tôi</label>
              </div>
            </>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button 
              disabled={loading} 
              className="btn-primary login-btn" 
              type="submit"
              style={{
                width: '100%', padding: '14px 20px', borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)',
                color: 'white', fontSize: '16px', fontWeight: '800', cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.25)', transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {loading ? 'Vui lòng đợi...' : 'Đăng Nhập'}
            </button>
          </div>
        </form>

        <div className="login-footer" style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <p>© 2026 RNDSP Deadline Management. All rights reserved.</p>
        </div>
      </div>
    </div>
);
};

export default Login;
