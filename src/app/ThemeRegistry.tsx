"use client";

import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FFBC11",
      light: "#FFD54F",
      dark: "#FFA000",
    },
    secondary: {
      main: "#1D2B3A",
      light: "#1A237E",
      dark: "#050A14",
    },
    background: {
      default: "#FFFFFF",
      paper: "#F8F9FA",
    },
    error: {
      main: "#E74C3C", // 재고 부족 등 경고 표시용
    },
    success: {
      main: "#2ECC71", // 할인율, 특가 표시용
    },
  },
  typography: {
    fontFamily: [
      "Pretendard",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 800, // ExtraBold
      fontSize: "2rem",
    },
    h2: {
      fontWeight: 700, // Bold
      fontSize: "1.75rem",
    },
    h3: {
      fontWeight: 700, // Bold
      fontSize: "1.5rem",
    },
    h4: {
      fontWeight: 700, // Bold
      fontSize: "1.25rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.1rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500, // Medium
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "0.875rem",
      fontWeight: 400, // Regular
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.75rem",
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: "0.875rem",
      fontWeight: 600,
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 16px",
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#FFA000",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "text.secondary",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: "6px",
        },
        paperWidthSm: {
          maxWidth: 600,
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px",
          paddingTop: "0px",
        },
      },
    },
  },
});

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "mui" });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
