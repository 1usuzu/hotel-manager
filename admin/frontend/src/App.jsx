// ===========================
// App.jsx
// Bao toàn bộ hệ thống bởi:
// - AuthProvider: quản lý đăng nhập
// - AppDataProvider: quản lý dữ liệu toàn admin
// - ProtectedRoute: chặn vào admin nếu chưa login
// ===========================

import React from "react";

import { AuthProvider } from "./context/AuthContext";
import { AppDataProvider } from "./context/AppDataContext";
import ProtectedRoute from "./protected/ProtectedRoute";

import AdminLayout from "./layouts/AdminLayout";

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      </AppDataProvider>
    </AuthProvider>
  );
}
