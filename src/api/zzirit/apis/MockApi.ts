/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  APIApi,
  AddItemRequest,
  UpdateItemRequest,
  FindBrandByTypeRequest,
  DeleteItemRequest,
  CreateTimeDealRequest,
  UploadImageOperationRequest,
} from "./APIApi";
import type {
  BaseResponseEmpty,
  BaseResponseListTypeResponse,
  BaseResponseListBrandResponse,
  TypeResponse,
  BrandResponse,
  TimeDealCreateResponse,
  BaseResponse,
  BaseResponseImageUploadResponse,
} from "../models/index";
import type { ApiResponse } from "../runtime";
import * as runtime from "../runtime";
import itemsData from "../mocks/items.json";
import timedealsData from "../mocks/timedeals.json";
import typesData from "../mocks/types.json";
import brandsData from "../mocks/brands.json";

// 아이템 인터페이스 정의
interface MockItem {
  id: number;
  name: string;
  imageUrl: string;
  stockQuantity: number;
  type: string;
  brand: string;
  price: number;
}

// 타임딜 인터페이스 정의
interface MockTimeDeal {
  id: number; // timeDealId로부터 매핑
  title: string; // timeDealName으로부터 매핑
  startTime: string;
  endTime: string;
  discountRate: number;
  items: Array<{
    itemId: number;
    itemName: string;
    quantity: number;
    originalPrice: number;
    finalPrice?: number; // 선택적 필드
  }>;
  status: string; // "UPCOMING" | "ONGOING" | "ENDED"
}

// 실제 타임딜 데이터 인터페이스 (JSON 파일의 형식과 일치)
interface RawTimeDealData {
  timeDealId: number;
  timeDealName: string;
  startTime: string;
  endTime: string;
  status: string;
  discountRate: number;
  items: Array<{
    itemId: number;
    itemName: string;
    quantity: number;
    originalPrice: number;
    finalPrice: number;
  }>;
}

// 페이지 데이터 인터페이스 정의
interface MockPageData {
  success: boolean;
  code: number;
  httpStatus: number;
  message: string;
  result: {
    content: MockItem[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
}

// 타임딜 페이지 데이터 인터페이스 정의
interface MockTimeDealPageData {
  success: boolean;
  code: number;
  httpStatus: number;
  message: string;
  result: {
    content: RawTimeDealData[]; // 실제 JSON 데이터의 형식
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
}

// 타임딜 생성 응답을 위한 커스텀 타입
interface MockTimeDealCreateResponse extends BaseResponse {
  result?: {
    timeDealId?: number;
    title?: string;
    startTime?: string;
    endTime?: string;
    discountRate?: number;
    items?: Array<{
      itemId?: number;
      quantity?: number;
    }>;
  };
}

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

// 임시 코드 getItems이 APIApi에 없어서 추가
declare module "./APIApi" {
  interface APIApi {
    getItems(page?: number): Promise<Response>;
    getTimeDeals(page?: number): Promise<Response>;
  }
}

APIApi.prototype.getItems = async function (page?: number): Promise<Response> {
  throw new Error("Not implemented in base APIApi");
};

APIApi.prototype.getTimeDeals = async function (
  page?: number
): Promise<Response> {
  throw new Error("Not implemented in base APIApi");
};

export class MockApi extends APIApi {
  // 모든 아이템을 단일 배열로 관리
  private allItems: MockItem[] = itemsData.result.content as MockItem[];

  // 실제 타임딜 데이터를 MockTimeDeal 형식으로 변환 (정적 메서드로 변경)
  private static convertRawTimeDealToMockTimeDeal(
    raw: RawTimeDealData
  ): MockTimeDeal {
    return {
      id: raw.timeDealId,
      title: raw.timeDealName,
      startTime: raw.startTime,
      endTime: raw.endTime,
      discountRate: raw.discountRate,
      status: raw.status,
      items: raw.items.map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        originalPrice: item.originalPrice,
        finalPrice: item.finalPrice,
      })),
    };
  }

  // 모든 타임딜을 단일 배열로 관리 - 데이터 구조 변환 처리
  private allTimeDeals: MockTimeDeal[] = (
    timedealsData.result.content as RawTimeDealData[]
  ).map(MockApi.convertRawTimeDealToMockTimeDeal);

  // 페이지네이션된 아이템 데이터 생성
  private createItemPageData(
    page: number,
    pageSize: number = 10
  ): MockPageData {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageContent = this.allItems.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.allItems.length / pageSize);

    return {
      success: true,
      code: 1073741824,
      httpStatus: 1073741824,
      message: "MOCK: 아이템 목록 조회 성공",
      result: {
        content: pageContent,
        pageable: {
          pageNumber: page - 1,
          pageSize: pageSize,
          sort: {
            empty: true,
            sorted: false,
            unsorted: true,
          },
          offset: (page - 1) * pageSize,
          paged: true,
          unpaged: false,
        },
        last: page >= totalPages,
        totalPages: totalPages,
        totalElements: this.allItems.length,
        size: pageSize,
        number: page - 1,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        first: page === 1,
        numberOfElements: pageContent.length,
        empty: pageContent.length === 0,
      },
    };
  }

  // 페이지네이션된 타임딜 데이터 생성
  private createTimeDealPageData(
    page: number,
    pageSize: number = 10
  ): MockTimeDealPageData {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageContent = this.allTimeDeals.slice(startIndex, endIndex);
    const totalPages = Math.ceil(this.allTimeDeals.length / pageSize);

    // MockTimeDeal을 RawTimeDealData로 다시 변환
    const rawPageContent: RawTimeDealData[] = pageContent.map((timeDeal) => ({
      timeDealId: timeDeal.id,
      timeDealName: timeDeal.title,
      startTime: timeDeal.startTime,
      endTime: timeDeal.endTime,
      discountRate: timeDeal.discountRate,
      status: timeDeal.status,
      items: timeDeal.items.map((item) => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        originalPrice: item.originalPrice,
        finalPrice:
          item.finalPrice ||
          item.originalPrice * (1 - timeDeal.discountRate / 100),
      })),
    }));

    return {
      success: true,
      code: 1073741824,
      httpStatus: 1073741824,
      message: "MOCK: 타임딜 목록 조회 성공",
      result: {
        content: rawPageContent,
        pageable: {
          pageNumber: page - 1,
          pageSize: pageSize,
          sort: {
            empty: true,
            sorted: false,
            unsorted: true,
          },
          offset: (page - 1) * pageSize,
          paged: true,
          unpaged: false,
        },
        last: page >= totalPages,
        totalPages: totalPages,
        totalElements: this.allTimeDeals.length,
        size: pageSize,
        number: page - 1,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        first: page === 1,
        numberOfElements: rawPageContent.length,
        empty: rawPageContent.length === 0,
      },
    };
  }

  async addItemRaw(
    requestParameters: AddItemRequest,
    _initOverrides?: RequestInit
  ): Promise<ApiResponse<BaseResponseEmpty>> {
    try {
      // 새 아이템 ID 생성 (기존 ID 중 가장 큰 값 + 1)
      let maxId = 0;
      this.allItems.forEach((item: MockItem) => {
        if (item.id > maxId) maxId = item.id;
      });

      const newItemId = maxId + 1;
      const createRequest = requestParameters.itemCreateRequest;

      // items.json에서 랜덤 이미지 URL 선택
      const existingItems = itemsData.result.content as MockItem[];
      const randomItemIndex = Math.floor(Math.random() * existingItems.length);
      const imageUrl = existingItems[randomItemIndex].imageUrl;

      // 타입과 브랜드 정보 가져오기
      let typeName = "기타";
      let brandName = "기타";

      // 타입 정보 가져오기
      if (createRequest.typeId !== undefined) {
        const typeData = typesData as BaseResponseListTypeResponse;
        if (typeData.result) {
          const typeInfo = typeData.result.find(
            (type: TypeResponse) => type.typeId === createRequest.typeId
          );
          if (typeInfo && typeInfo.name) {
            typeName = typeInfo.name;
          }
        }
      }

      // 브랜드 정보 가져오기
      if (createRequest.brandId !== undefined) {
        Object.values(
          brandsData as Record<string, BaseResponseListBrandResponse>
        ).some((brandData) => {
          if (brandData.result) {
            const brand = brandData.result.find(
              (b: BrandResponse) => b.brandId === createRequest.brandId
            );
            if (brand && brand.name) {
              brandName = brand.name;
              return true;
            }
          }
          return false;
        });
      }

      // 새 아이템 생성
      const newItem: MockItem = {
        id: newItemId,
        name: createRequest.name || `상품 ${newItemId}`,
        imageUrl: imageUrl,
        stockQuantity: createRequest.stockQuantity || 0,
        type: typeName,
        brand: brandName,
        price: createRequest.price || 0,
      };

      // 아이템 배열에 추가
      this.allItems.push(newItem);

      // 커스텀 응답 생성 (BaseResponseEmpty와 호환되는 타입)
      const response: BaseResponseEmpty = {
        success: true,
        code: 201,
        message: "MOCK: 상품이 성공적으로 추가되었습니다.",
        result: {
          itemId: newItemId,
        },
      };

      return {
        raw: new Response(JSON.stringify(response), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        }),
        value: async () => response,
      };
    } catch (error) {
      console.error("상품 추가 중 오류 발생:", error);
      return {
        raw: new Response(
          JSON.stringify({
            success: false,
            code: 500,
            message: "MOCK: 상품 추가 중 오류가 발생했습니다.",
            result: {},
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        ),
        value: async () => ({
          success: false,
          code: 500,
          message: "MOCK: 상품 추가 중 오류가 발생했습니다.",
          result: {},
        }),
      };
    }
  }

  async addItem(
    requestParameters: AddItemRequest,
    _initOverrides?: RequestInit
  ): Promise<BaseResponseEmpty> {
    const response = await this.addItemRaw(requestParameters, _initOverrides);
    return await response.value();
  }

  async getItems(page: number = 1) {
    const pageData = this.createItemPageData(page);
    return createMockResponse(pageData);
  }

  async getTimeDeals(page: number = 1) {
    const pageData = this.createTimeDealPageData(page);
    return createMockResponse(pageData);
  }

  async findTypeRaw(
    _initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ApiResponse<BaseResponseListTypeResponse>> {
    return {
      raw: new Response(JSON.stringify(typesData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
      value: async () => typesData as BaseResponseListTypeResponse,
    };
  }

  async findBrandByTypeRaw(
    requestParameters: FindBrandByTypeRequest,
    _initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ApiResponse<BaseResponseListBrandResponse>> {
    const typeId = requestParameters.typeId;
    const brandData = (
      brandsData as Record<string, BaseResponseListBrandResponse>
    )[typeId.toString()];

    if (!brandData) {
      return {
        raw: new Response(
          JSON.stringify({
            success: true,
            code: 1073741824,
            httpStatus: 1073741824,
            message: "해당 타입의 브랜드가 없습니다.",
            result: [],
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        ),
        value: async () => ({
          success: true,
          code: 1073741824,
          httpStatus: 1073741824,
          message: "해당 타입의 브랜드가 없습니다.",
          result: [],
        }),
      };
    }

    return {
      raw: new Response(JSON.stringify(brandData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
      value: async () => brandData as BaseResponseListBrandResponse,
    };
  }

  async updateItemRaw(
    requestParameters: UpdateItemRequest,
    _initOverrides?: RequestInit
  ): Promise<ApiResponse<BaseResponseEmpty>> {
    const itemId = requestParameters.itemId;
    const updateData = requestParameters.itemCreateRequest;

    // 아이템 찾기
    const itemIndex = this.allItems.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      return {
        raw: new Response(
          JSON.stringify({
            code: 404,
            message: "MOCK: 상품을 찾을 수 없습니다.",
            result: {},
          }),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        ),
        value: async () => ({
          code: 404,
          message: "MOCK: 상품을 찾을 수 없습니다.",
          result: {},
        }),
      };
    }

    // 아이템 업데이트
    const item = this.allItems[itemIndex];

    // 필드 업데이트
    if (updateData.name !== undefined) item.name = updateData.name;
    if (updateData.stockQuantity !== undefined)
      item.stockQuantity = updateData.stockQuantity;
    if (updateData.price !== undefined) item.price = updateData.price;
    if (updateData.typeId !== undefined) {
      // 목데이터(typesData)에서 타입 정보 가져오기
      const typeData = typesData as BaseResponseListTypeResponse;
      if (typeData.result) {
        const typeInfo = typeData.result.find(
          (type: TypeResponse) => type.typeId === updateData.typeId
        );
        if (typeInfo && typeInfo.name) {
          item.type = typeInfo.name;
        }
      }
    }
    if (updateData.brandId !== undefined) {
      const brandId = updateData.brandId;
      let brandName = "";

      Object.values(
        brandsData as Record<string, BaseResponseListBrandResponse>
      ).some((brandData) => {
        if (brandData.result) {
          const brand = brandData.result.find(
            (b: BrandResponse) => b.brandId === brandId
          );
          if (brand && brand.name) {
            brandName = brand.name;
            return true;
          }
        }
        return false;
      });

      if (brandName) {
        item.brand = brandName;
      }
    }

    return {
      raw: mockResponse,
      value: async () => ({
        code: 200,
        message: "MOCK: 상품이 성공적으로 수정되었습니다.",
        result: {},
      }),
    };
  }

  /**
   * 관리자가 id로 상품을 삭제합니다.
   * 관리자 상품 삭제
   */
  async deleteItem(
    requestParameters: DeleteItemRequest,
    _initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<BaseResponseEmpty> {
    const { itemId } = requestParameters;

    // 아이템 찾기
    const itemIndex = this.allItems.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      // 아이템 삭제
      this.allItems.splice(itemIndex, 1);
    }

    // 삭제 성공 응답 반환
    return {
      success: true,
      code: 1073741824,
      httpStatus: 1073741824,
      message:
        itemIndex !== -1
          ? `상품 ID ${itemId}가 성공적으로 삭제되었습니다.`
          : `상품 ID ${itemId}가 존재하지 않습니다.`,
    };
  }

  /**
   * 타임딜을 생성합니다.
   * 타임딜 생성
   */
  async createTimeDeal(
    requestParameters: CreateTimeDealRequest,
    _initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<TimeDealCreateResponse> {
    interface TimeDealItem {
      itemId: number;
      quantity: number;
    }

    interface TimeDealRequestBody {
      title: string;
      startTime: string;
      endTime: string;
      discountRate: number;
      items: TimeDealItem[];
    }

    // 타임딜 상태 결정 함수
    function determineTimeDealStatus(
      startTime: string,
      endTime: string
    ): string {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (now < start) {
        return "UPCOMING"; // 시작 시간 이전 (예정됨)
      } else if (now >= start && now <= end) {
        return "ONGOING"; // 시작 시간 이후, 종료 시간 이전 (진행중)
      } else {
        return "ENDED"; // 종료 시간 이후 (종료됨)
      }
    }

    // 타입 안전성을 위해 any를 사용하지 않고 unknown으로 변환 후 타입 체크
    const rawRequestBody = requestParameters.requestBody as unknown;

    // 타입 가드 함수
    function isTimeDealRequestBody(obj: unknown): obj is TimeDealRequestBody {
      if (typeof obj !== "object" || obj === null) return false;

      const rb = obj as Record<string, unknown>;
      return (
        typeof rb.title === "string" &&
        typeof rb.startTime === "string" &&
        typeof rb.endTime === "string" &&
        typeof rb.discountRate === "number" &&
        Array.isArray(rb.items)
      );
    }

    if (!rawRequestBody || !isTimeDealRequestBody(rawRequestBody)) {
      return {
        timeDealId: undefined,
        title: undefined,
        startTime: undefined,
        endTime: undefined,
        discountRate: undefined,
        items: undefined,
      };
    }

    const requestBody = rawRequestBody;

    try {
      // 새로운 타임딜 ID 생성 (기존 ID 중 가장 큰 값 + 1)
      let maxId = 0;
      this.allTimeDeals.forEach((timeDeal: MockTimeDeal) => {
        if (timeDeal.id > maxId) maxId = timeDeal.id;
      });

      const newTimeDealId = maxId + 1;

      // 새 타임딜 생성
      const newTimeDeal: MockTimeDeal = {
        id: newTimeDealId,
        title: requestBody.title,
        startTime: requestBody.startTime,
        endTime: requestBody.endTime,
        discountRate: requestBody.discountRate,
        items: requestBody.items.map((item: TimeDealItem) => {
          // 아이템 정보 찾기
          const itemInfo = this.allItems.find((i) => i.id === item.itemId);
          const originalPrice = itemInfo?.price || 0;
          const finalPrice =
            originalPrice * (1 - requestBody.discountRate / 100);

          return {
            itemId: item.itemId,
            itemName: itemInfo?.name || `상품 ${item.itemId}`,
            quantity: item.quantity,
            originalPrice: originalPrice,
            finalPrice: finalPrice,
          };
        }),
        // 시작/종료 시간을 기준으로 상태 결정
        status: determineTimeDealStatus(
          requestBody.startTime,
          requestBody.endTime
        ),
      };

      // 타임딜 배열에 새 타임딜 추가
      this.allTimeDeals.push(newTimeDeal);

      // TimeDealCreateResponse 형식으로 반환
      return {
        timeDealId: newTimeDealId,
        title: requestBody.title,
        startTime: requestBody.startTime,
        endTime: requestBody.endTime,
        discountRate: requestBody.discountRate,
        items: requestBody.items.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
        })),
      };
    } catch (error) {
      console.error("타임딜 생성 중 오류 발생:", error);
      return {
        timeDealId: undefined,
        title: undefined,
        startTime: undefined,
        endTime: undefined,
        discountRate: undefined,
        items: undefined,
      };
    }
  }

  /**
   * 관리자가 id로 상품 이미지를 업로드합니다.
   * 관리자 상품 이미지 업로드
   */
  async uploadImageRaw(
    requestParameters: UploadImageOperationRequest,
    _initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ApiResponse<BaseResponseImageUploadResponse>> {
    try {
      const { itemId } = requestParameters;

      // 상품 존재 여부 확인
      const itemExists = this.allItems.some((item) => item.id === itemId);

      if (!itemExists) {
        return {
          raw: new Response(
            JSON.stringify({
              success: false,
              code: 404,
              httpStatus: 404,
              message: "MOCK: 상품을 찾을 수 없습니다.",
              result: undefined,
            }),
            {
              status: 404,
              headers: { "Content-Type": "application/json" },
            }
          ),
          value: async () => ({
            success: false,
            code: 404,
            httpStatus: 404,
            message: "MOCK: 상품을 찾을 수 없습니다.",
            result: undefined,
          }),
        };
      }

      // 목 데이터를 위한 가상 이미지 URL 생성
      const mockImageUrl = `https://example.com/images/item-${itemId}-${Date.now()}.jpg`;

      // 성공 응답 반환
      return {
        raw: new Response(
          JSON.stringify({
            success: true,
            code: 200,
            httpStatus: 200,
            message: "MOCK: 이미지가 성공적으로 업로드되었습니다.",
            result: {
              imageUrl: mockImageUrl,
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        ),
        value: async () => ({
          success: true,
          code: 200,
          httpStatus: 200,
          message: "MOCK: 이미지가 성공적으로 업로드되었습니다.",
          result: {
            imageUrl: mockImageUrl,
          },
        }),
      };
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생:", error);
      return {
        raw: new Response(
          JSON.stringify({
            success: false,
            code: 500,
            httpStatus: 500,
            message: "MOCK: 이미지 업로드 중 오류가 발생했습니다.",
            result: undefined,
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        ),
        value: async () => ({
          success: false,
          code: 500,
          httpStatus: 500,
          message: "MOCK: 이미지 업로드 중 오류가 발생했습니다.",
          result: undefined,
        }),
      };
    }
  }

  /**
   * 관리자가 id로 상품 이미지를 업로드합니다.
   * 관리자 상품 이미지 업로드
   */
  async uploadImage(
    requestParameters: UploadImageOperationRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<BaseResponseImageUploadResponse> {
    const response = await this.uploadImageRaw(
      requestParameters,
      initOverrides
    );
    return await response.value();
  }

  // 필요에 따라 다른 메서드도 오버라이드해서 mock 데이터 반환 가능
}
