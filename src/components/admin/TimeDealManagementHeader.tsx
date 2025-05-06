"use client";

import React from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface TimeDealManagementHeaderProps {
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
}

export default function TimeDealManagementHeader({
  statusFilter,
  setStatusFilter,
}: TimeDealManagementHeaderProps) {
  const theme = useTheme();

  // 모든 요소의 통일된 높이 설정
  const elementHeight = 40;

  return (
    <>
      {/* 검색 및 필터 영역 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mt: 2,
          mb: 3,
          height: elementHeight,
        }}
      >
        <Box sx={{ width: 200 }}>
          <TextField
            select
            fullWidth
            value="타임딜 이름"
            size="small"
            slotProps={{
              select: {
                native: true,
              },
            }}
            sx={{
              height: elementHeight,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1.5,
                backgroundColor: theme.palette.background.paper,
                height: elementHeight,
              },
              "& .MuiInputBase-input": {
                height: elementHeight - 16,
                paddingTop: 0,
                paddingBottom: 0,
                display: "flex",
                alignItems: "center",
              },
            }}
          >
            <option value="타임딜 이름">타임딜 이름</option>
            <option value="타임딜 아이디">타임딜 아이디</option>
          </TextField>
        </Box>

        <TextField
          placeholder="찾으려는 타임딜을 검색하세요"
          variant="outlined"
          size="small"
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{
            height: elementHeight,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              backgroundColor: theme.palette.background.paper,
              height: elementHeight,
            },
            "& .MuiInputBase-input": {
              height: elementHeight - 16,
              paddingTop: 0,
              paddingBottom: 0,
              display: "flex",
              alignItems: "center",
            },
          }}
        />

        {/* 상태 필터 */}
        <Box
          sx={{ ml: "auto", display: "flex", gap: 1, height: elementHeight }}
        >
          <Button
            variant={!statusFilter ? "contained" : "outlined"}
            onClick={() => setStatusFilter(null)}
            sx={{
              borderRadius: 1.5,
              height: elementHeight,
              minWidth: 70,
              fontSize: "0.875rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
              ...(statusFilter === null
                ? {}
                : { color: theme.palette.text.secondary }),
            }}
          >
            전체
          </Button>
          <Button
            variant={statusFilter === "ONGOING" ? "contained" : "outlined"}
            onClick={() => setStatusFilter("ONGOING")}
            sx={{
              borderRadius: 1.5,
              height: elementHeight,
              minWidth: 80,
              fontSize: "0.875rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
              ...(statusFilter === "ONGOING"
                ? { bgcolor: theme.palette.success.main }
                : { color: theme.palette.success.main }),
            }}
          >
            진행중
          </Button>
          <Button
            variant={statusFilter === "UPCOMING" ? "contained" : "outlined"}
            onClick={() => setStatusFilter("UPCOMING")}
            sx={{
              borderRadius: 1.5,
              height: elementHeight,
              minWidth: 80,
              fontSize: "0.875rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
              ...(statusFilter === "UPCOMING"
                ? { bgcolor: theme.palette.info.main }
                : { color: theme.palette.info.main }),
            }}
          >
            예정됨
          </Button>
          <Button
            variant={statusFilter === "ENDED" ? "contained" : "outlined"}
            onClick={() => setStatusFilter("ENDED")}
            sx={{
              borderRadius: 1.5,
              height: elementHeight,
              minWidth: 80,
              fontSize: "0.875rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
              ...(statusFilter === "ENDED"
                ? { bgcolor: theme.palette.error.main }
                : { color: theme.palette.error.main }),
            }}
          >
            종료됨
          </Button>
        </Box>
      </Box>
    </>
  );
}
