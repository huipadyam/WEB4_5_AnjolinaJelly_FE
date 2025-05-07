import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Header() {
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
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "primary.main", letterSpacing: 1 }}
        >
          Zzirit
        </Typography>

        {/* 가운데: 검색 인풋 + 검색 버튼 */}
        <Box sx={{ flex: 1, mx: 4, maxWidth: 480 }}>
          <TextField
            fullWidth
            placeholder="찌릿 상품을 검색해보세요!"
            size="small"
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
                  <IconButton edge="end" color="primary">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* 우측: 장바구니, 마이페이지 */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton color="primary">
            <ShoppingCartIcon />
          </IconButton>
          <IconButton color="primary">
            <AccountCircleIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
