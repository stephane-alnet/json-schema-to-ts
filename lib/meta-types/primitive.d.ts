import { Get } from "../utils";
export declare type PrimitiveType = "primitive";
export declare type BrandedPrimitiveType = "brandedPrimitive";
export declare type Primitive<L> = {
    type: PrimitiveType;
    value: L;
};
export declare const BrandName: unique symbol;
export interface Branded<B> {
    [BrandName]: B;
}
export declare type BrandedPrimitive<L, B> = {
    type: BrandedPrimitiveType;
    value: L;
    brand: B;
};
export declare type Value<L> = Get<L, "value">;
export declare type ResolvePrimitive<T> = Get<T, "value">;
export declare type ResolveBrandedPrimitive<T> = Get<T, "value"> & Branded<Get<T, "brand">>;
