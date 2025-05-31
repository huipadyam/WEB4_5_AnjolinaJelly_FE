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
import ClearIcon from "@mui/icons-material/Clear";
import { TimeDealSearchField } from "@/hooks/useTimeDealsWithPagination";

interface TimeDealManagementHeaderProps {
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  // 검색 관련 props 추가
  searchField: TimeDealSearchField;
  searchQuery: string;
  onSearchFieldChange: (field: TimeDealSearchField) => void;
  onSearchQueryChange: (query: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  isSearching: boolean;
}

export default function TimeDealManagementHeader({
  statusFilter,
  setStatusFilter,
  searchField,
  searchQuery,
  onSearchFieldChange,
  onSearchQueryChange,
  onSearch,
  onClearSearch,
  isSearching,
}: TimeDealManagementHeaderProps) {
  const theme = useTheme();

  // 모든 요소의 통일된 높이 설정
  const elementHeight = 40;

  // 검색 필드 변경 핸들러
  const handleSearchFieldChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    onSearchFieldChange(e.target.value as TimeDealSearchField);
  };

  // 검색어 변경 핸들러
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchQueryChange(e.target.value);
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    onSearch();
  };

  // 검색어 입력 필드에서 엔터키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 검색 초기화 핸들러
  const handleClearSearch = () => {
    onClearSearch();
  };

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
            value={searchField}
            onChange={handleSearchFieldChange}
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
            <option value="timeDealName">타임딜 이름</option>
            <option value="timeDealId">타임딜 아이디</option>
          </TextField>
        </Box>

        <TextField
          placeholder="찾으려는 타임딜을 검색하세요"
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={handleSearchQueryChange}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {isSearching ? (
                  <IconButton onClick={handleClearSearch} size="small">
                    <ClearIcon />
                  </IconButton>
                ) : null}
                <IconButton onClick={handleSearch} size="small" color="primary">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
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
            onClick={() => {
              setStatusFilter(null);
            }}
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
            variant={statusFilter === "SCHEDULED" ? "contained" : "outlined"}
            onClick={() => setStatusFilter("SCHEDULED")}
            sx={{
              borderRadius: 1.5,
              height: elementHeight,
              minWidth: 80,
              fontSize: "0.875rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
              ...(statusFilter === "SCHEDULED"
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
