import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, LogIn } from "lucide-react";
import campusImg from "../assets/banner.jpg";
import logoImg from "../assets/logo.png";

function Login({ onLogin }) {
  const [maSV, setMaSV] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/sinhvien/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maSV, password }),
      });

      if (!res.ok) {
        throw new Error("Sai mã số sinh viên hoặc mật khẩu");
      }

      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          maSV,
          hoTen: data.user?.hoTen || data.hoTen || "Sinh viên",
        }),
      );
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
      {/* Bên trái: ảnh trường */}
      <div
        className="login-hero"
        style={{ backgroundImage: `url(${campusImg})` }}
      />

      {/* Bên phải: form */}
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
          <p className="login-subtitle">Đăng nhập bằng tài khoản sinh viên</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Mã số sinh viên</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  placeholder="Nhập mã số sinh viên"
                  value={maSV}
                  onChange={(e) => setMaSV(e.target.value)}
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
