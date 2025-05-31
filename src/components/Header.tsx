"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const [search, setSearch] = useState("");

  // 드롭다운 열기
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // 드롭다운 닫기
  const handleClose = () => {
    setAnchorEl(null);
  };
  // 마이페이지 이동
  const handleMyPage = () => {
    handleClose();
    router.push("/my-page");
  };
  // 로그아웃 처리
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
    handleClose();
    router.push("/sign-in");
  };
  // 검색 실행
  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/?keyword=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        borderBottom: "1px solid #E0E0E0",
        background:
          "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        py: 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
        {/* 좌측: 로고 텍스트 */}
        <Link href="/">
          <Image
            src="/zzirit_logo_alpha_crop.png"
            alt="Zzirit 로고"
            width={72}
            height={36}
          />
        </Link>

        {/* 가운데: 검색 인풋 + 검색 버튼 */}
        <Box sx={{ flex: 1, mx: 4, maxWidth: 480 }}>
          <TextField
            fullWidth
            placeholder="찌릿 상품을 검색해보세요!"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            sx={{
              backgroundColor: "#F8F9FA",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                pr: 1,
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    color="secondary"
                    onClick={handleSearch}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Link href="/cart">
            <IconButton color="secondary">
              <ShoppingCartIcon />
            </IconButton>
          </Link>
          {/* 마이페이지 드롭다운 */}
          <IconButton color="secondary" onClick={handleMenu}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleMyPage}>내 정보</MenuItem>
            <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
