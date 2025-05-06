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
  selectAll: boolean;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (id: number) => void;
  onUpdateItem?: (itemData: UpdateItemRequest) => Promise<void>;
  loading?: boolean;
}

export default function ItemTable({
  items,
  selectAll,
  onSelectAll,
  onSelectOne,
  onUpdateItem,
  loading = false,
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

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 10,
        }}
      >
        <CircularProgress />
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
        }}
      >
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
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onSelectOne={onSelectOne}
                onEdit={handleEditItem}
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
