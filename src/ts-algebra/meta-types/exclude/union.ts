import { A, B, U } from "ts-toolbelt";

import { Error, Type } from "..";
import { Union, UnionValues, UnionType } from "../union";
import { Intersect } from "../intersect";

import { $Exclude } from ".";

export type DistributeUnion<
  U extends UnionType,
  E extends Type,
  V extends any = RecurseOnUnion<UnionValues<U>, E>
> =
  /**
   * @debt "Casting intersected Values union as Type has unexpected side effects"
   */
  // @ts-expect-error
  Union<V>;

type RecurseOnUnion<V extends Type, E extends Type> = V extends infer T
  ? // @ts-expect-error: T necessarily extends Type
    $Exclude<T, E>
  : never;

export type ExcludeUnion<T extends Type, U extends UnionType> = A.Equals<
  UnionValues<U>,
  never
> extends B.True
  ? T // @ts-expect-error: U.Last<UnionValues<U>> necessarily extends Type
  : ExcludeUnionValue<T, U.Last<UnionValues<U>>, U>;

type ExcludeUnionValue<
  T extends Type,
  L extends Type,
  U extends UnionType,
  X1 extends any = $Exclude<T, L>,
  X2 extends any = $Exclude<T, Union<U.Exclude<UnionValues<U>, L>>>
> = X1 extends Type
  ? X2 extends Type
    ? Intersect<X1, X2>
    : Error<"[ExcludeUnionValue] Exclude result does not extend MetaType">
  : Error<"[ExcludeUnionValue] Exclude result does not extend MetaType">;
