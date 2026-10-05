const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// ===== Quản lý token =====
export const auth = {
  getAccess: () => localStorage.getItem("access_token"),
  getRefresh: () => localStorage.getItem("refresh_token"),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  },
  save: (data) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
  },
  clear: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  },
};

// Khi phiên hết hạn hẳn: App lắng nghe sự kiện này để về trang đăng nhập
function forceLogout() {
  auth.clear();
  window.dispatchEvent(new Event("auth:logout"));
}

async function parse(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

function toError(res, data) {
  const msg = Array.isArray(data?.message)
    ? data.message.join(", ")
    : data?.message || `Lỗi ${res.status}`;
  const err = new Error(msg);
  err.status = res.status;
  return err;
}

async function rawFetch(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    return await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      "Không kết nối được máy chủ. Kiểm tra backend đã chạy chưa.",
    );
  }
}

// ===== Refresh: chỉ chạy 1 lần dù nhiều request cùng 401 =====
let refreshing = null;

function refreshTokens() {
  if (!refreshing) {
    refreshing = (async () => {
      const refresh_token = auth.getRefresh();
      if (!refresh_token) throw new Error("Chưa đăng nhập");
      const res = await rawFetch("/auth/refresh", {
        method: "POST",
        body: { refresh_token },
      });
      const data = await parse(res);
      if (!res.ok) throw toError(res, data);
      auth.save(data);
      return data.access_token;
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

// ===== Request chính =====
async function request(path, options = {}) {
  let res = await rawFetch(path, { ...options, token: auth.getAccess() });

  // Access token hết hạn: refresh rồi gọi lại đúng 1 lần
  if (res.status === 401 && auth.getRefresh()) {
    try {
      const newToken = await refreshTokens();
      res = await rawFetch(path, { ...options, token: newToken });
    } catch {
      forceLogout();
      throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    }
  }

  if (res.status === 401) {
    forceLogout();
    throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
  }

  const data = await parse(res);
  if (!res.ok) throw toError(res, data);
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};

// ===== Đăng nhập / đăng xuất =====
export async function login(username, password) {
  const res = await rawFetch("/auth/login", {
    method: "POST",
    body: { username, password },
  });
  const data = await parse(res);
  if (!res.ok) throw toError(res, data);
  auth.save(data);
  return data.user;
}

export async function logout() {
  try {
    const token = auth.getAccess();
    if (token) await rawFetch("/auth/logout", { method: "POST", token });
  } catch {
    // bỏ qua lỗi mạng, vẫn xóa token phía client
  }
  auth.clear();
}
