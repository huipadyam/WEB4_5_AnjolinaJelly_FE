"use client";

import { Box, TableCell, TableRow, Checkbox, Chip } from "@mui/material";
import { Item } from "@/types/admin";

interface ItemRowProps {
  item: Item;
  onSelectOne: (id: number) => void;
  onEdit: (item: Item) => void;
}

export default function ItemRow({ item, onSelectOne, onEdit }: ItemRowProps) {
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleRowClick = (e: React.MouseEvent) => {
    // 체크박스를 클릭한 경우 행 클릭 이벤트가 발생하지 않도록 함
    if ((e.target as HTMLElement).closest(".checkbox-cell")) {
      return;
    }
    onEdit(item);
  };

  return (
    <TableRow
      key={item.id}
      hover
      onClick={handleRowClick}
      sx={{
        bgcolor: item.selected ? "rgba(44, 62, 80, 0.05)" : "inherit",
        "&:nth-of-type(odd)": {
          backgroundColor: item.selected
            ? "rgba(44, 62, 80, 0.05)"
            : "rgba(0, 0, 0, 0.02)",
        },
        "&:hover": {
          backgroundColor: "rgba(44, 62, 80, 0.08)",
          cursor: "pointer",
        },
        transition: "background-color 0.2s ease",
      }}
    >
      <TableCell padding="checkbox" className="checkbox-cell">
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
      <TableCell>{item.stock}</TableCell>
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
      <TableCell sx={{ fontWeight: 600 }}>₩{formatPrice(item.price)}</TableCell>
    </TableRow>
  );
}
