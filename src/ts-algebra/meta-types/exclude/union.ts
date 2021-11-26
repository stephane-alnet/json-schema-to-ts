import { A, B, U } from "ts-toolbelt";

import { Error, Type } from "..";
import { Union, UnionValues, UnionType } from "../union";
import { $Intersect } from "../intersect";

import { $Exclude } from ".";

export type DistributeUnion<
  U extends UnionType,
  E extends Type,
  V = RecurseOnUnion<UnionValues<U>, E>
> = Union<
  V extends infer T
    ? T extends Type
      ? T
      : Error<"[DistributeUnion] Excluded Source Type does not extend Meta.Type">
    : never
>;

type RecurseOnUnion<V extends Type, E extends Type> = V extends infer T
  ? T extends Type
    ? $Exclude<T, E>
    : Error<"[RecurseOnUnion] Excluded Source Type does not extend Meta.Type">
  : never;

export type ExcludeUnion<T extends Type, U extends UnionType> = A.Equals<
  UnionValues<U>,
  never
> extends B.True
  ? T
  : ExcludeLastUnionValue<T, U>;

type ExcludeLastUnionValue<
  T extends Type,
  U extends UnionType,
  L = U.Last<UnionValues<U>>
> = L extends Type
  ? ExcludeUnionValue<T, L, U>
  : Error<"[ExcludeLastUnionValue] Last Union Value does not extend Meta.Type">;

type ExcludeUnionValue<
  T extends Type,
  L extends Type,
  U extends UnionType,
  X1 = $Exclude<T, L>,
  X2 = $Exclude<T, Union<U.Exclude<UnionValues<U>, L>>>
> = $Intersect<X1, X2>;
