import { Box, CircularProgress } from "@mui/material";

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}
