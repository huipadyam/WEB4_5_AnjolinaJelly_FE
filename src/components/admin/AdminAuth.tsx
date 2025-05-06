"use client";

import { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";

interface AdminAuthProps {
  onAuth: () => void;
}

export default function AdminAuth({ onAuth }: AdminAuthProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setError("");
  };

  const handleAuth = () => {
    // 환경 변수에서 설정한 비밀번호와 비교
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (password === adminPassword) {
      // 로컬스토리지에 인증 상태 저장 (새로고침 시에도 유지)
      localStorage.setItem("admin_authenticated", "true");
      onAuth();
    } else {
      setError("비밀번호가 일치하지 않습니다");
    }
  };

  // Enter 키로 제출하기
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleAuth();
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          관리자 로그인
        </Typography>
        <TextField
          label="비밀번호"
          type="password"
          fullWidth
          value={password}
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
          error={!!error}
          helperText={error}
          autoFocus
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleAuth}
          sx={{ mt: 2 }}
        >
          접속하기
        </Button>
      </Paper>
    </Box>
  );
}
