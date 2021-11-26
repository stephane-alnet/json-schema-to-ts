import { Type } from "..";
import { Never } from "../never";
import { Union, UnionValues, UnionType } from "../union";
import { Error } from "../error";

import { Intersect } from ".";

export type IntersectUnion<A extends UnionType, B extends Type> = {
  any: A;
  never: Never;
  const: DistributeUnionIntersection<A, B>;
  enum: DistributeUnionIntersection<A, B>;
  boolean: DistributeUnionIntersection<A, B>;
  primitive: DistributeUnionIntersection<A, B>;
  array: DistributeUnionIntersection<A, B>;
  tuple: DistributeUnionIntersection<A, B>;
  object: DistributeUnionIntersection<A, B>;
  union: DistributeUnionIntersection<A, B>;
  intersection: Error<"Cannot intersect intersection">;
  error: B;
}[B["type"]];

export type DistributeUnionIntersection<
  A extends UnionType,
  B extends Type,
  V = RecurseOnUnion<UnionValues<A>, B>
> = Union<
  V extends infer T
    ? T extends Type
      ? T
      : Error<"[DistributeUnionIntersection] Intersected Type does not extend Meta.Type">
    : never
>;

type RecurseOnUnion<V extends Type, B extends Type> = V extends infer T
  ? T extends Type
    ? Intersect<T, B>
    : Error<"[RecurseOnUnion] Intersected Type does not extend Meta.Type">
  : never;
