import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, LogIn } from "lucide-react";
import { login } from "../api";
import campusImg from "../assets/banner.jpg";
import logoImg from "../assets/logo.png";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username.trim(), password);
      onLogin();
      navigate("/sinh-vien");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div
        className="login-hero"
        style={{ backgroundImage: `url(${campusImg})` }}
      />

      <div className="login-side">
        <div className="login-brand">
          <img
            src={logoImg}
            alt="Logo Trường Đại học Quy Nhơn"
            className="login-logo"
          />
          <div className="login-school">TRƯỜNG ĐẠI HỌC QUY NHƠN</div>
          <div className="login-system">HỆ THỐNG QUẢN LÝ ĐỒ ÁN TỐT NGHIỆP</div>
        </div>

        <div className="login-box">
          <h2>ĐĂNG NHẬP</h2>
          <p className="login-subtitle">Dành cho cán bộ quản lý của Khoa</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Tên đăng nhập</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Mật khẩu</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" disabled={loading}>
              <LogIn size={18} />
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
