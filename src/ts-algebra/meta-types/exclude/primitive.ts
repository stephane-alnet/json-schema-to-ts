import { Never, Type } from "..";
import { PrimitiveValue, PrimitiveType } from "../primitive";
import { UnionType } from "../union";
import { IntersectionType } from "../intersection";

import { ExcludeUnion } from "./union";
import { ExcludeIntersection } from "./intersection";

export type ExcludeFromPrimitive<A extends PrimitiveType, B extends Type> = {
  any: Never;
  never: A;
  const: A;
  enum: A;
  boolean: A;
  primitive: B extends PrimitiveType ? ExcludePrimitive<A, B> : never;
  array: A;
  tuple: A;
  object: A;
  union: B extends UnionType ? ExcludeUnion<A, B> : never;
  intersection: B extends IntersectionType
    ? // @ts-expect-error
      ExcludeIntersection<A, B>
    : never;
  error: B;
}[B["type"]];

type ExcludePrimitive<
  A extends PrimitiveType,
  B extends PrimitiveType
> = PrimitiveValue<A> extends PrimitiveValue<B> ? Never : A;
