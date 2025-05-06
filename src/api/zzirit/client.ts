import { APIApi } from "./apis/APIApi";
import { MockApi } from "./apis/MockApi";
import { Configuration } from "./runtime";

const config = new Configuration({
  // 필요시 basePath, accessToken 등 환경변수로 전달
});

const apiMode = process.env.NEXT_PUBLIC_API_MODE;

export const client =
  apiMode === "mock" ? new MockApi(config) : new APIApi(config);
