import {
  UserRound,
  Users,
  BookOpen,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import logoImg from "./assets/logo.png";
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import SinhVien from "./pages/SinhVien";
import DeTai from "./pages/DeTai";
import DangKy from "./pages/DangKy";
import "./App.css";
import { ToastProvider } from "./components/Toast";

const MENU = [
  {
    key: "project",
    title: "ĐỒ ÁN TỐT NGHIỆP",
    items: [
      { to: "/sinh-vien", label: "Sinh viên", icon: Users },
      { to: "/de-tai", label: "Đề tài", icon: BookOpen },
      { to: "/dang-ky", label: "Đăng ký", icon: ClipboardList },
    ],
  },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebar-collapsed") === "true",
  );

  const [openGroups, setOpenGroups] = useState({ project: true });
  const toggleGroup = (key) => setOpenGroups((g) => ({ ...g, [key]: !g[key] }));

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  // Lưu trạng thái để lần sau mở lại vẫn giữ nguyên
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  // Phím tắt Ctrl + B
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/sinh-vien" />
              ) : (
                <Login onLogin={() => setIsLoggedIn(true)} />
              )
            }
          />
          <Route
            path="/*"
            element={
              isLoggedIn ? (
                <div className="layout">
                  <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
                    <button
                      className="sidebar-toggle"
                      onClick={() => setCollapsed((c) => !c)}
                      aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
                      title={
                        collapsed ? "Mở rộng (Ctrl+B)" : "Thu gọn (Ctrl+B)"
                      }
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div className="sidebar-logo">
                      <img src={logoImg} alt="Logo Trường Đại học Quy Nhơn" />
                    </div>

                    <div className="sidebar-profile">
                      <div className="profile-panel">
                        <div className="avatar">
                          <UserRound size={24} />
                        </div>
                        <div className="profile-info">
                          <div className="profile-name">
                            {user.hoTen || "Sinh viên"}
                          </div>
                          <div className="profile-role">
                            Sinh viên{user.maSV ? ` - ${user.maSV}` : ""}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="sidebar-scroll">
                      {MENU.map((group) => (
                        <div className="nav-group" key={group.key}>
                          <button
                            className="nav-group-header"
                            onClick={() => toggleGroup(group.key)}
                          >
                            <span className="nav-group-title">
                              {group.title}
                            </span>
                            <ChevronDown
                              size={16}
                              className={openGroups[group.key] ? "" : "rotated"}
                            />
                          </button>

                          <div
                            className={`nav-group-body ${openGroups[group.key] ? "open" : ""}`}
                          >
                            <div className="nav-group-inner">
                              {group.items.map(({ to, label, icon: Icon }) => (
                                <NavLink
                                  key={to}
                                  to={to}
                                  className="nav-link"
                                  data-tooltip={label}
                                >
                                  <Icon size={20} />
                                  <span className="nav-text">{label}</span>
                                </NavLink>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="sidebar-footer">
                      <button
                        className="logout-btn"
                        onClick={handleLogout}
                        data-tooltip="Đăng xuất"
                      >
                        <LogOut size={20} />
                        <span className="nav-text">Đăng xuất</span>
                      </button>
                    </div>
                  </aside>
                  <main className="content">
                    <Routes>
                      <Route path="/sinh-vien" element={<SinhVien />} />
                      <Route path="/de-tai" element={<DeTai />} />
                      <Route path="/dang-ky" element={<DangKy />} />
                      <Route path="/" element={<SinhVien />} />
                    </Routes>
                  </main>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
