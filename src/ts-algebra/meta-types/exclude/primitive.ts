import { Never, Error, Type } from "..";
import { PrimitiveValue, PrimitiveType } from "../primitive";
import { UnionType } from "../union";

import { ExcludeUnion } from "./union";

export type ExcludeFromPrimitive<A extends PrimitiveType, B extends Type> = {
  any: Never;
  never: A;
  const: A;
  enum: A;
  primitive: B extends PrimitiveType ? ExcludePrimitive<A, B> : Error<"">;
  array: A;
  tuple: A;
  object: A;
  union: B extends UnionType ? ExcludeUnion<A, B> : Error<"">;
  error: B;
}[B["type"]];

type ExcludePrimitive<
  A extends PrimitiveType,
  B extends PrimitiveType
> = PrimitiveValue<A> extends PrimitiveValue<B> ? Never : A;
