import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  useTheme,
} from "@mui/material";
import { TimeDeal } from "@/hooks/useTimeDealsWithPagination";
import { format } from "date-fns";

interface TimeDealRowProps {
  timeDeal: TimeDeal;
  isExpanded: boolean;
}

export default function TimeDealRow({
  timeDeal,
  isExpanded,
}: TimeDealRowProps) {
  const theme = useTheme();

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy.MM.dd HH:mm");
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR");
  };

  // 타임딜 상태 텍스트 및 색상
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "ONGOING":
        return {
          text: "진행중",
          color: "white",
          bgcolor: theme.palette.success.main,
        };
      case "SCHEDULED":
        return {
          text: "예정됨",
          color: "white",
          bgcolor: theme.palette.info.main,
        };
      case "ENDED":
        return {
          text: "종료됨",
          color: "white",
          bgcolor: theme.palette.error.main,
        };
      default:
        return {
          text: "알 수 없음",
          color: "white",
          bgcolor: theme.palette.grey[700],
        };
    }
  };

  const statusInfo = getStatusInfo(timeDeal.status);

  return (
    <Paper
      elevation={1}
      sx={{
        mb: 2,
        overflow: "hidden",
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        transition: "box-shadow 0.3s",
        "&:hover": {
          boxShadow: 2,
        },
      }}
    >
      {/* 타임딜 헤더 */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: isExpanded
            ? `1px solid ${theme.palette.divider}`
            : "none",
          bgcolor: isExpanded ? "rgba(0, 0, 0, 0.02)" : "inherit",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 2 }}>
              {timeDeal.timeDealName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              포함 상품: {timeDeal.items.length}개
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            ID: {timeDeal.timeDealId} | 할인율: {timeDeal.discountRate}% |{" "}
            {formatDateTime(timeDeal.startTime)} ~{" "}
            {formatDateTime(timeDeal.endTime)}
          </Typography>
        </Box>
        <Box>
          <Chip
            label={statusInfo.text}
            size="small"
            sx={{
              bgcolor: statusInfo.bgcolor,
              color: statusInfo.color,
              fontWeight: "bold",
              fontSize: "0.8rem",
              height: 28,
              px: 1,
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          />
        </Box>
      </Box>

      {/* 타임딜 상품 목록 (확장되었을 때만 표시) */}
      {isExpanded && (
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: "rgba(0, 0, 0, 0.03)" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "medium" }}>No</TableCell>
                <TableCell sx={{ fontWeight: "medium" }}>상품 이름</TableCell>
                <TableCell align="center" sx={{ fontWeight: "medium" }}>
                  수량
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "medium" }}>
                  기존 가격
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "medium" }}>
                  할인율
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "medium" }}>
                  타임딜 적용 가격
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timeDeal.items.map((item, index) => (
                <TableRow
                  key={`${timeDeal.timeDealId}-${item.itemId}-${index}`}
                  sx={{
                    "&:nth-of-type(odd)": {
                      bgcolor: "rgba(0, 0, 0, 0.01)",
                    },
                  }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {item.itemName}
                  </TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {formatPrice(item.originalPrice)}원
                  </TableCell>
                  <TableCell align="right">{timeDeal.discountRate}%</TableCell>
                  <TableCell align="right">
                    {formatPrice(item.finalPrice)}원
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
