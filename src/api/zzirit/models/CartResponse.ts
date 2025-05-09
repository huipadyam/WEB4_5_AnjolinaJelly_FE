/* tslint:disable */
/* eslint-disable */
/**
 * zzirit API
 * 찌릿 API 명세서
 *
 * The version of the OpenAPI document: v0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { CartItemResponse } from './CartItemResponse';
import {
    CartItemResponseFromJSON,
    CartItemResponseFromJSONTyped,
    CartItemResponseToJSON,
    CartItemResponseToJSONTyped,
} from './CartItemResponse';

/**
 * 
 * @export
 * @interface CartResponse
 */
export interface CartResponse {
    /**
     * 
     * @type {number}
     * @memberof CartResponse
     */
    cartId?: number;
    /**
     * 
     * @type {Array<CartItemResponse>}
     * @memberof CartResponse
     */
    items?: Array<CartItemResponse>;
    /**
     * 
     * @type {number}
     * @memberof CartResponse
     */
    totalQuantity?: number;
    /**
     * 
     * @type {number}
     * @memberof CartResponse
     */
    totalAmount?: number;
}

/**
 * Check if a given object implements the CartResponse interface.
 */
export function instanceOfCartResponse(value: object): value is CartResponse {
    return true;
}

export function CartResponseFromJSON(json: any): CartResponse {
    return CartResponseFromJSONTyped(json, false);
}

export function CartResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): CartResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'cartId': json['cartId'] == null ? undefined : json['cartId'],
        'items': json['items'] == null ? undefined : ((json['items'] as Array<any>).map(CartItemResponseFromJSON)),
        'totalQuantity': json['totalQuantity'] == null ? undefined : json['totalQuantity'],
        'totalAmount': json['totalAmount'] == null ? undefined : json['totalAmount'],
    };
}

export function CartResponseToJSON(json: any): CartResponse {
    return CartResponseToJSONTyped(json, false);
}

export function CartResponseToJSONTyped(value?: CartResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'cartId': value['cartId'],
        'items': value['items'] == null ? undefined : ((value['items'] as Array<any>).map(CartItemResponseToJSON)),
        'totalQuantity': value['totalQuantity'],
        'totalAmount': value['totalAmount'],
    };
}

