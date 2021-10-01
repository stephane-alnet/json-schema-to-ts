import { Error } from ".";

export type PrimitiveId = "primitive";

export type Primitive<L extends null | boolean | number | string> = {
  type: PrimitiveId;
  value: L;
};

export type $Primitive<L> = L extends null | boolean | number | string
  ? Primitive<L>
  : Error<"Type provided to $Primitive does not extend null | boolean | number | string">;

export type PrimitiveType = Primitive<null | boolean | number | string>;

export type PrimitiveValue<P extends PrimitiveType> = P["value"];

export type ResolvePrimitive<P extends PrimitiveType> = PrimitiveValue<P>;
