"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Box,
  Button,
  Card,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import Image from "next/image";

// 폼 유효성 검사 스키마 정의
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "이메일을 입력해주세요." })
    .email({ message: "올바른 이메일 형식이 아닙니다." }),
  password: z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." })
    .max(100, { message: "비밀번호가 너무 깁니다." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // TODO: 로그인 API 호출 로직 구현
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        padding: { xs: 2, sm: 4 },
        background:
          "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: "450px",
          padding: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow:
            "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
        }}
      >
        <Typography component="h1" variant="h3" sx={{ fontWeight: 700 }}>
          로그인
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="email" sx={{ mb: 1, fontWeight: 500 }}>
              이메일
            </FormLabel>
            <TextField
              id="email"
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F8F9FA",
                  "& fieldset": {
                    borderColor: "#E0E0E0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#BDBDBD",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="password" sx={{ mb: 1, fontWeight: 500 }}>
              비밀번호
            </FormLabel>
            <TextField
              id="password"
              type="password"
              placeholder="••••••"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register("password")}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#F8F9FA",
                  "& fieldset": {
                    borderColor: "#E0E0E0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#BDBDBD",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
          </FormControl>

          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="로그인 상태 유지"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              py: 1.5,
              borderRadius: 2,
              fontSize: "1rem",
            }}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>

          <Link
            href="#"
            variant="body2"
            sx={{
              alignSelf: "center",
              color: "primary.main",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            비밀번호를 잊으셨나요?
          </Link>
        </Box>

        <Divider sx={{ my: 2 }}>또는</Divider>

        <Stack spacing={2}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={() => {
              // TODO: 구글 로그인 구현
            }}
            sx={{
              borderColor: "#E0E0E0",
              color: "#000000",
              backgroundColor: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#F5F5F5",
                borderColor: "#E0E0E0",
              },
              py: 1.5,
              borderRadius: 2,
            }}
          >
            구글로 계속하기
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={
              <Image src="/kakao-logo.png" alt="Kakao" width={20} height={20} />
            }
            onClick={() => {
              // TODO: 카카오 로그인 구현
            }}
            sx={{
              backgroundColor: "#FEE500",
              color: "#000000",
              "&:hover": {
                backgroundColor: "#FDD835",
              },
              py: 1.5,
              borderRadius: 2,
            }}
          >
            카카오로 계속하기
          </Button>

          <Button
            fullWidth
            variant="contained"
            startIcon={
              <Image src="/naver-logo.png" alt="Naver" width={20} height={20} />
            }
            onClick={() => {
              // TODO: 네이버 로그인 구현
            }}
            sx={{
              backgroundColor: "#03C75A",
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "#02B350",
              },
              py: 1.5,
              borderRadius: 2,
            }}
          >
            네이버로 계속하기
          </Button>
        </Stack>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            아직 계정이 없으신가요?{" "}
            <Link
              href="/sign-up"
              sx={{
                color: "primary.main",
                textDecoration: "none",
                fontWeight: 600,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              회원가입
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
