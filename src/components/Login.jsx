import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Key, Eye, EyeOff } from 'lucide-react';

const DEPT_LOGINS = [
  { id: 'rnd', name: 'Phòng RNDSP', displayNames: ['Trà', 'Thanh', 'Nam'] },
  { id: 'design', name: 'Phòng HY Design', displayNames: ['Linh'] },
  { id: 'mms', name: 'Phòng MMKP', displayNames: ['Lan Anh', 'Trang'] },
  { id: 'hn-mkt', name: 'Phòng HN MKT', displayNames: ['Phuc'] },
  { id: 'evolution', name: 'Phòng Evolution', displayNames: ['Thảo'] },
  { id: 'crm', name: 'Phòng CRM', displayNames: ['CRM1', 'CRM2'] }
];

const Login = () => {
  const [selectedDeptId, setSelectedDeptId] = useState('rnd');
  const [selectedName, setSelectedName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Automatically update the display name when department changes
  useEffect(() => {
    const dept = DEPT_LOGINS.find(d => d.id === selectedDeptId);
    if (dept && dept.displayNames.length > 0) {
      setSelectedName(dept.displayNames[0]);
    }
  }, [selectedDeptId]);

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      // Perform login with selected department ID, typed password, and chosen display name
      await login(selectedDeptId, password, selectedName);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Sai mật khẩu hoặc quyền truy cập bị từ chối.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #eef4f8 0%, #d8e3ed 100%)',
      fontFamily: "'Nunito', -apple-system, sans-serif",
      overflow: 'hidden',
      padding: '20px'
    }}>
      {/* Decorative Blur Circles for Glassmorphism Background Depth */}
      <div style={{
        width: '320px',
        height: '320px',
        background: 'rgba(43, 112, 201, 0.14)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        position: 'absolute',
        top: '15%',
        left: '20%',
        zIndex: 1
      }} />
      <div style={{
        width: '380px',
        height: '380px',
        background: 'rgba(14, 165, 233, 0.12)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        position: 'absolute',
        bottom: '15%',
        right: '20%',
        zIndex: 1
      }} />

      {/* Main Login Card */}
      <div className="animate-fade-in" style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '430px',
        background: '#ffffff',
        borderRadius: '32px',
        padding: '48px 36px 40px 36px',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        
        {/* Blue Rounded Key Icon Block */}
        <div style={{
          width: '76px',
          height: '76px',
          background: 'linear-gradient(135deg, #2b70c9 0%, #1e5ba3 100%)',
          borderRadius: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(43, 112, 201, 0.25)',
          marginBottom: '24px'
        }}>
          <Key size={34} style={{ color: '#fbbf24', transform: 'rotate(-45deg)' }} />
        </div>

        {/* Header Text */}
        <h1 style={{
          fontSize: '22px',
          fontWeight: '900',
          color: '#0f172a',
          letterSpacing: '0.5px',
          marginBottom: '10px',
          textTransform: 'uppercase',
          textAlign: 'center'
        }}>
          Đăng nhập phòng ban
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#64748b',
          fontWeight: '600',
          lineHeight: '1.5',
          maxWidth: '310px',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          Chọn phòng ban của bạn và nhập mật khẩu truy cập để chỉnh sửa báo cáo liên kết.
        </p>

        {/* Error Display */}
        {error && (
          <div style={{
            width: '100%',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          
          {/* Department Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#475569',
              letterSpacing: '0.75px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              display: 'block'
            }}>
              Phòng ban / Department
            </label>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '14px',
                border: '1px solid #cbd5e1',
                fontFamily: 'inherit',
                fontSize: '15px',
                fontWeight: '700',
                background: '#ffffff',
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2b70c9';
                e.target.style.boxShadow = '0 0 0 3px rgba(43, 112, 201, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            >
              {DEPT_LOGINS.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Member Name Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#475569',
              letterSpacing: '0.75px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              display: 'block'
            }}>
              Tên thành viên / Member
            </label>
            <select
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderRadius: '14px',
                border: '1px solid #cbd5e1',
                fontFamily: 'inherit',
                fontSize: '15px',
                fontWeight: '700',
                background: '#ffffff',
                color: '#1e293b',
                outline: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2b70c9';
                e.target.style.boxShadow = '0 0 0 3px rgba(43, 112, 201, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            >
              {DEPT_LOGINS.find(d => d.id === selectedDeptId)?.displayNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#475569',
              letterSpacing: '0.75px',
              textTransform: 'uppercase',
              marginBottom: '8px',
              display: 'block'
            }}>
              Mật khẩu / Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Nhập mật khẩu..."
                style={{
                  width: '100%',
                  padding: '13px 44px 13px 16px',
                  borderRadius: '14px',
                  border: '1px solid #cbd5e1',
                  fontFamily: 'inherit',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#1e293b',
                  background: '#ffffff',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2b70c9';
                  e.target.style.boxShadow = '0 0 0 3px rgba(43, 112, 201, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            style={{
              width: '100%',
              padding: '14px 20px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #2b70c9 0%, #1e5ba3 100%)',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 8px 20px rgba(43, 112, 201, 0.25)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(43, 112, 201, 0.35)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(43, 112, 201, 0.25)';
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(1px)';
            }}
          >
            {loading ? 'Đang xác thực...' : '🔑 Đăng nhập'}
          </button>

        </form>

        {/* Footer Credit */}
        <div style={{
          marginTop: '36px',
          fontSize: '11px',
          color: '#94a3b8',
          fontWeight: '600'
        }}>
          © 2026 RNDSP Deadline Management.
        </div>

      </div>
    </div>
  );
};

export default Login;
