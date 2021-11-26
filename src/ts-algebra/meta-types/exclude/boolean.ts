import { Never, Type } from "..";
import { BooleanType } from "../boolean";
import { UnionType } from "../union";
import { IntersectionType } from "../intersection";

import { ExcludeUnion } from "./union";
import { ExcludeIntersection } from "./intersection";

export type ExcludeFromBoolean<A extends BooleanType, B extends Type> = {
  any: Never;
  never: A;
  const: A;
  enum: A;
  boolean: Never;
  primitive: A;
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
