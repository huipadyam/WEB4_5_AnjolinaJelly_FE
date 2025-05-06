"use client";

import { Box, Divider, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import AdminPageTabs from "@/components/admin/AdminPageTabs";
import ItemManagementTab from "@/components/admin/ItemManagementTab";
import TimeDealManagementTab from "@/components/admin/TimeDealManagementTab";
import AdminAuth from "@/components/admin/AdminAuth";
import LoadingScreen from "@/components/admin/LoadingScreen";

export default function AdminPage() {
  const [mainTabValue, setMainTabValue] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleMainTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setMainTabValue(newValue);
  };

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      const isAuth = localStorage.getItem("admin_authenticated") === "true";
      setIsAuthenticated(isAuth);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // 로딩 중일 때 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 비밀번호 입력 화면
  if (!isAuthenticated) {
    return <AdminAuth onAuth={handleAuth} />;
  }

  // 인증되었을 때 관리자 페이지 내용 표시
  return (
    <Box sx={{ p: 3, maxWidth: "100%", maxHeight: "100%" }}>
      <Typography variant="h4" gutterBottom>
        상품 관리
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* 메인 탭 - 상품 관리 vs 타임딜 관리 */}
      <AdminPageTabs value={mainTabValue} onChange={handleMainTabChange} />

      {/* 상품 관리 컨텐츠 */}
      {mainTabValue === 0 && <ItemManagementTab />}

      {/* 타임딜 관리 컨텐츠 */}
      {mainTabValue === 1 && <TimeDealManagementTab />}
    </Box>
  );
}
