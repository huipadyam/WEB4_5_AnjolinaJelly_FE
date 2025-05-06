import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StorefrontIcon from "@mui/icons-material/Storefront";

interface AdminPageTabsProps {
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export default function AdminPageTabs({ value, onChange }: AdminPageTabsProps) {
  return (
    <Tabs
      value={value}
      onChange={onChange}
      sx={{
        "& .MuiTab-root": {
          minWidth: 160,
          fontWeight: "medium",
        },
        "& .Mui-selected": {
          fontWeight: "bold",
        },
        "& .MuiTabs-indicator": {
          height: 3,
        },
        mb: 3,
      }}
    >
      <Tab
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StorefrontIcon fontSize="small" />
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
  );
}
