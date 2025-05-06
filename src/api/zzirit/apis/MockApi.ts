/* eslint-disable @typescript-eslint/no-unused-vars */
import { APIApi, AddItemRequest } from "./APIApi";
import type { BaseResponseEmpty } from "../models/index";
import type { ApiResponse } from "../runtime";
import items from "../mocks/items.json";

// 실제 응답과 유사한 mock 데이터 예시
const mockBaseResponseEmpty: BaseResponseEmpty = {
  code: 200,
  message: "MOCK: 성공적으로 처리되었습니다.",
  result: {},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockResponse = (data: any) => {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

// 최소한의 mock Response 객체 생성
const mockResponse = new Response(JSON.stringify(mockBaseResponseEmpty), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});

export class MockApi extends APIApi {
  async addItemRaw(
    _requestParameters: AddItemRequest,
    _initOverrides?: RequestInit
  ): Promise<ApiResponse<BaseResponseEmpty>> {
    return {
      raw: mockResponse,
      value: async () => mockBaseResponseEmpty,
    };
  }

  async addItem(
    _requestParameters: AddItemRequest,
    _initOverrides?: RequestInit
  ): Promise<BaseResponseEmpty> {
    return mockBaseResponseEmpty;
  }

  async getItems() {
    return createMockResponse(items);
  }

  // 필요에 따라 다른 메서드도 오버라이드해서 mock 데이터 반환 가능
}
