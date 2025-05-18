"use client";

import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  useTheme,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Item } from "@/types/admin";
import { useState } from "react";
import ItemRow from "./ItemRow";
import ItemEditModal from "./ItemEditModal";

// API 요청에 필요한 타입 정의
interface UpdateItemRequest {
  itemId: number;
  itemCreateRequest: {
    name?: string;
    stockQuantity?: number;
    price?: number;
    typeId?: number;
    brandId?: number;
  };
}

// 수정 데이터 타입 정의
interface ItemEditData {
  api: UpdateItemRequest;
  ui: Item;
}

interface ItemTableProps {
  items: Item[];
  page: number;
  selectAll: boolean;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (id: number) => void;
  onUpdateItem?: (itemData: UpdateItemRequest) => Promise<void>;
  loading?: boolean;
  isPageChanging?: boolean;
  isSearching?: boolean;
}

export default function ItemTable({
  items,
  page,
  selectAll,
  onSelectAll,
  onSelectOne,
  onUpdateItem,
  loading = false,
  isPageChanging = false,
  isSearching = false,
}: ItemTableProps) {
  const theme = useTheme();
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEditItem = (item: Item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditItem(null);
  };

  const handleSaveItem = async (data: ItemEditData) => {
    try {
      if (onUpdateItem) {
        await onUpdateItem(data.api);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to update item:", error);
      handleCloseModal();
    }
  };

  if (loading && !isPageChanging) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          py: 10,
          height: "300px",
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" mt={2}>
          상품 목록을 불러오는 중...
        </Typography>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
        }}
      >
        <Typography variant="body1" color="textSecondary">
          {isSearching
            ? "검색 결과가 존재하지 않습니다. 다른 검색어를 입력해보세요."
            : "표시할 상품이 없습니다."}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          position: "relative",
        }}
      >
        {isPageChanging && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255,255,255,0.7)",
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress size={36} />
          </Box>
        )}
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableCell padding="checkbox" sx={{ color: "white" }}>
                <Checkbox
                  checked={selectAll}
                  onChange={onSelectAll}
                  sx={{
                    color: "white",
                    "&.Mui-checked": {
                      color: "white",
                    },
                  }}
                />
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                No.
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                이미지
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                상품 이름
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                상품 번호
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                재고
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                상품 종류
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                브랜드
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                가격
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <ItemRow
                key={item.id}
                item={item}
                onSelectOne={onSelectOne}
                onEdit={handleEditItem}
                index={(page - 1) * 10 + index}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 수정 모달 */}
      <ItemEditModal
        open={editModalOpen}
        item={editItem}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
      />
    </>
  );
}
