"use client";

import {
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import React, { useState } from "react";
import ItemAddModal from "./ItemAddModal";

interface ItemManagementHeaderProps {
  onDelete: () => void;
  selectedItemsCount: number;
  onCreateTimeDeal?: () => void;
  onItemAdded?: () => void;
}

export default function ItemManagementHeader({
  onDelete,
  selectedItemsCount,
  onCreateTimeDeal,
  onItemAdded,
}: ItemManagementHeaderProps) {
  const theme = useTheme();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 모든 요소의 통일된 높이 설정
  const elementHeight = 40;

  // 상품 추가 모달 열기
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  // 상품 추가 모달 닫기
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // 상품 추가 성공 후 처리
  const handleItemAdded = () => {
    // 부모 컴포넌트에 상품이 추가되었음을 알림
    if (onItemAdded) {
      onItemAdded();
    }
  };

  return (
    <>
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
            value="상품 이름"
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
            <option value="상품 이름">상품 이름</option>
            <option value="상품 아이디">상품 아이디</option>
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

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          sx={{
            ml: "auto",
            borderRadius: 1.5,
            boxShadow: 2,
            height: elementHeight,
            minWidth: 100,
            fontSize: "0.875rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          상품 추가
        </Button>

        <Button
          variant="contained"
          startIcon={<AccessTimeIcon />}
          onClick={onCreateTimeDeal}
          disabled={selectedItemsCount === 0}
          sx={{
            borderRadius: 1.5,
            boxShadow: 2,
            height: elementHeight,
            minWidth: 140,
            px: 2,
            fontSize: "0.875rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
            bgcolor: theme.palette.info.main,
            "&:hover": { bgcolor: theme.palette.info.dark },
          }}
        >
          {selectedItemsCount > 0
            ? `타임딜 생성 (${selectedItemsCount})`
            : "타임딜 생성"}
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={onDelete}
          disabled={selectedItemsCount === 0}
          sx={{
            borderRadius: 1.5,
            boxShadow: 2,
            height: elementHeight,
            minWidth: 130,
            fontSize: "0.875rem",
            fontWeight: 500,
            whiteSpace: "nowrap",
            px: 2,
          }}
        >
          {selectedItemsCount > 0
            ? `상품 삭제 (${selectedItemsCount})`
            : "상품 삭제"}
        </Button>
      </Box>

      {/* 상품 추가 모달 */}
      <ItemAddModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleItemAdded}
      />
    </>
  );
}
