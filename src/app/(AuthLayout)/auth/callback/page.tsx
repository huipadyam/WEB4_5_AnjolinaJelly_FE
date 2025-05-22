"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Box,
  Button,
  Card,
  Stack,
  TextField,
  Typography,
  FormControl,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { alertService } from "@/components/admin/AlertSnackbar";
import { client } from "@/api/zzirit/client";

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상이어야 합니다." }),
    passwordConfirm: z
      .string()
      .min(8, { message: "비밀번호 확인을 입력해주세요." }),
    address: z.string().min(1, { message: "주소를 입력해주세요." }),
    detailAddress: z.string().min(1, { message: "상세주소를 입력해주세요." }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

// 카카오 도로명주소 API 타입 선언
interface DaumPostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: DaumPostcodeData) => void;
      }) => { open: () => void };
    };
  }
}

export default function SignUp() {
  const [address, setAddress] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  // 주소 검색 팝업 오픈 함수
  const handleOpenAddressPopup = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert(
        "주소 검색 서비스를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요."
      );
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data: DaumPostcodeData) {
        let fullAddress = data.address;
        let extraAddress = "";
        if (data.addressType === "R") {
          if (data.bname !== "") {
            extraAddress += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddress +=
              extraAddress !== ""
                ? ", " + data.buildingName
                : data.buildingName;
          }
          if (extraAddress !== "") {
            fullAddress += ` (${extraAddress})`;
          }
        }
        setAddress(fullAddress);
      },
    }).open();
  };

  // 주소 postMessage 이벤트 핸들러
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.address) {
        setAddress(event.data.address);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // 회원가입 폼 제출 핸들러
  const onSubmit = async (data: SignUpFormData) => {
    try {
      await client.auth.completeSignup({
        socialSignupRequest: {
          memberName: data.name,
          memberPassword: data.password,
          memberAddress: address,
          memberAddressDetail: data.detailAddress,
        },
      });
      alertService.showAlert("회원가입이 완료되었습니다!", "success");
      router.push("/");
    } catch (error: unknown) {
      let message = "회원가입에 실패했습니다. 다시 시도해주세요.";
      if (error instanceof Error) {
        message = error.message;
      }
      alertService.showAlert(message, "error");
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
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          sx={{ fontWeight: 700, mb: 2 }}
          color="primary.dark"
        >
          ZZirit
        </Typography>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
          추가 정보 입력
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          {/* 이름 */}
          <FormControl>
            <TextField
              id="name"
              label="이름"
              placeholder=""
              InputLabelProps={{ shrink: true }}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              color="secondary"
            />
          </FormControl>

          {/* 비밀번호 */}
          <FormControl>
            <TextField
              id="password"
              label="비밀번호"
              placeholder=""
              InputLabelProps={{ shrink: true }}
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              color="secondary"
            />
          </FormControl>

          {/* 비밀번호 확인 */}
          <FormControl>
            <TextField
              id="passwordConfirm"
              label="비밀번호 확인"
              placeholder=""
              InputLabelProps={{ shrink: true }}
              type="password"
              {...register("passwordConfirm")}
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm?.message}
              color="secondary"
            />
          </FormControl>

          {/* 주소 */}
          <FormControl>
            <Stack direction="row" spacing={1}>
              <TextField
                id="address"
                label="주소"
                placeholder=""
                InputLabelProps={{ shrink: true }}
                {...register("address")}
                value={address}
                error={!!errors.address}
                helperText={errors.address?.message}
                InputProps={{ readOnly: true }}
                color="secondary"
              />
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpenAddressPopup}
              >
                검색
              </Button>
            </Stack>
          </FormControl>

          {/* 상세주소 */}
          <FormControl>
            <TextField
              id="detailAddress"
              label="상세주소"
              placeholder=""
              InputLabelProps={{ shrink: true }}
              {...register("detailAddress")}
              error={!!errors.detailAddress}
              helperText={errors.detailAddress?.message}
              color="secondary"
            />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 1, py: 1.5, borderRadius: 2, fontSize: "1rem" }}
          >
            회원가입
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
