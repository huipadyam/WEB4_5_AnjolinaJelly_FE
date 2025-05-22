import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { format } from "date-fns";
import { TimeDeal } from "@/hooks/useTimeDealsWithPagination";

interface TimeDealDetailPanelProps {
  timeDeal: TimeDeal;
}

export default function TimeDealDetailPanel({
  timeDeal,
}: TimeDealDetailPanelProps) {
  // 타임딜 상태에 따른 칩 색상 설정
  const getStatusColor = (
    status: string
  ): "success" | "info" | "error" | "default" => {
    switch (status) {
      case "ONGOING":
        return "success";
      case "SCHEDULED":
        return "info";
      case "ENDED":
        return "error";
      default:
        return "default";
    }
  };

  // 타임딜 상태 한글화
  const getStatusText = (status: string) => {
    switch (status) {
      case "ONGOING":
        return "진행 중";
      case "SCHEDULED":
        return "예정됨";
      case "ENDED":
        return "종료됨";
      default:
        return "알 수 없음";
    }
  };

  // 가격 포맷
  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR");
  };

  // 날짜 포맷팅
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "yyyy.MM.dd HH:mm");
  };

  return (
    <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
        타임딜 ID: {timeDeal.timeDealId}, 타임딜 이름: {timeDeal.timeDealName}
      </Typography>

      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Chip
          label={getStatusText(timeDeal.status)}
          color={getStatusColor(timeDeal.status)}
          size="small"
        />
        <Typography>
          {formatDateTime(timeDeal.startTime)} ~{" "}
          {formatDateTime(timeDeal.endTime)}
        </Typography>
        <Typography sx={{ ml: "auto", fontWeight: "bold" }}>
          할인율: {timeDeal.discountRate}%
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#e0e0e0" }}>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>상품 이름</TableCell>
              <TableCell align="center">수량</TableCell>
              <TableCell align="right">기존 가격</TableCell>
              <TableCell align="right">할인 가격</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeDeal.items.map((item, index) => (
              <TableRow key={item.itemId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">
                  {formatPrice(item.originalPrice)}
                </TableCell>
                <TableCell align="right">
                  {formatPrice(item.finalPrice)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
