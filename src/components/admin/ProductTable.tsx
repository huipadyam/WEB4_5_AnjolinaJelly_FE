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
  Chip,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Item } from "@/types/admin";

interface ItemTableProps {
  items: Item[];
  selectAll: boolean;
  onSelectAll: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectOne: (id: number) => void;
  loading?: boolean;
}

export default function ItemTable({
  items,
  selectAll,
  onSelectAll,
  onSelectOne,
  loading = false,
}: ItemTableProps) {
  const theme = useTheme();

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
            <TableRow
              key={item.id}
              hover
              sx={{
                bgcolor: item.selected ? "rgba(44, 62, 80, 0.05)" : "inherit",
                "&:nth-of-type(odd)": {
                  backgroundColor: item.selected
                    ? "rgba(44, 62, 80, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
                },
                "&:hover": {
                  backgroundColor: "rgba(44, 62, 80, 0.08)",
                },
                transition: "background-color 0.2s ease",
              }}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  checked={item.selected}
                  onChange={() => onSelectOne(item.id)}
                />
              </TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                    borderRadius: 1,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
              <TableCell>{item.itemNumber}</TableCell>
              <TableCell>
                {item.stock < 60 ? (
                  <Chip
                    label={item.stock}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      bgcolor: "#FF3B30",
                      color: "white",
                    }}
                  />
                ) : (
                  item.stock
                )}
              </TableCell>
              <TableCell>
                <Chip
                  label={item.category}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(44, 62, 80, 0.08)",
                    fontWeight: 500,
                  }}
                />
              </TableCell>
              <TableCell>{item.brand}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>
                ₩{formatPrice(item.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
