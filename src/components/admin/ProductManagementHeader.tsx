"use client";

import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import React from "react";

interface ItemManagementHeaderProps {
  tabValue: number;
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function ItemManagementHeader({
  tabValue,
  onTabChange,
}: ItemManagementHeaderProps) {
  const theme = useTheme();

  return (
    <>
      <Tabs
        value={tabValue}
        onChange={onTabChange}
        sx={{
          "& .MuiTab-root": {
            minWidth: 120,
            fontWeight: "medium",
          },
          "& .Mui-selected": {
            color: theme.palette.primary.main,
            fontWeight: "bold",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: theme.palette.primary.main,
            height: 3,
          },
          mb: 3,
        }}
      >
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>일반 상품 관리</span>
            </Box>
          }
        />
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AccessTimeIcon fontSize="small" />
              <span>타임 딜 관리</span>
            </Box>
          }
        />
      </Tabs>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2, mb: 3 }}>
        <Box sx={{ width: 200 }}>
          <TextField
            select
            fullWidth
            value="상품 이름"
            size="small"
            slotProps={{
              select: {
                native: true,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                backgroundColor: theme.palette.background.paper,
              },
            }}
          >
            <option value="상품 이름">상품 이름</option>
            <option value="상품 번호">상품 번호</option>
          </TextField>
        </Box>

        <TextField
          placeholder="찾으려는 상품을 검색하세요"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        />

        <Button
          variant="contained"
          startIcon={<AccessTimeIcon />}
          sx={{
            bgcolor: theme.palette.secondary.main,
            "&:hover": { bgcolor: theme.palette.secondary.dark },
            ml: "auto",
            borderRadius: 1.5,
            boxShadow: 2,
          }}
        >
          타임 딜 생성
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            borderRadius: 1.5,
            boxShadow: 2,
          }}
        >
          상품 추가
        </Button>

        <Button
          variant="contained"
          startIcon={<EditIcon />}
          sx={{
            bgcolor: theme.palette.primary.light,
            "&:hover": { bgcolor: theme.palette.primary.dark },
            borderRadius: 1.5,
            boxShadow: 2,
          }}
        >
          상품 수정
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{
            borderRadius: 1.5,
            boxShadow: 2,
          }}
        >
          상품 삭제
        </Button>
      </Box>
    </>
  );
}
