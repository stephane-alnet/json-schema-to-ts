import { Never, Error, Type } from "..";
import { ConstType } from "../const";
import { EnumType } from "../enum";
import { PrimitiveValue, PrimitiveType } from "../primitive";
import { UnionType } from "../union";

import { IntersectConst } from "./const";
import { IntersectEnum } from "./enum";
import { IntersectUnion } from "./union";

export type IntersectPrimitive<A extends PrimitiveType, B extends Type> = {
  any: A;
  never: Never;
  const: B extends ConstType ? IntersectConst<B, A> : never;
  enum: B extends EnumType ? IntersectEnum<B, A> : never;
  boolean: Never;
  primitive: B extends PrimitiveType ? IntersectPrimitives<A, B> : never;
  array: Never;
  tuple: Never;
  object: Never;
  union: B extends UnionType ? IntersectUnion<B, A> : never;
  intersection: Error<"Cannot intersect intersection">;
  error: B;
}[B["type"]];

type IntersectPrimitives<
  A extends PrimitiveType,
  B extends PrimitiveType
> = PrimitiveValue<A> extends PrimitiveValue<B>
  ? A
  : PrimitiveValue<B> extends PrimitiveValue<A>
  ? B
  : Never;
