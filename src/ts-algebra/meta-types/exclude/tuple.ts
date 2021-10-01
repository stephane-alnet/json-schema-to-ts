import { A, B, L } from "ts-toolbelt";

import { And, Not } from "../../utils";

import { Never, Error, Type } from "..";
import { Const, ConstValue, ConstType } from "../const";
import { EnumType } from "../enum";
import { ArrayValues, ArrayType } from "../array";
import { Tuple, TupleValues, IsOpen, OpenProps, TupleType } from "../tuple";
import { UnionType } from "../union";
import { IsRepresentable } from "../isRepresentable";

import { $Exclude } from ".";
import { ExcludeEnum } from "./enum";
import { ExcludeUnion } from "./union";
import {
  CrossValue,
  CrossedValue,
  SourceValue,
  IsExclusionValueRepresentable,
  IsOutsideOfSourceScope,
  IsOutsideOfExcludedScope,
  Propagate,
  IsOmittable,
} from "./utils";

export type ExcludeFromTuple<S extends TupleType, E extends Type> = {
  any: Never;
  never: S;
  const: E extends ConstType ? ExcludeConst<S, E> : Error<"">;
  enum: E extends EnumType ? ExcludeEnum<S, E> : Error<"">;
  primitive: S;
  array: E extends ArrayType ? ExcludeArray<S, E> : Error<"">;
  tuple: E extends TupleType ? ExcludeTuples<S, E> : Error<"">;
  object: S;
  union: E extends UnionType ? ExcludeUnion<S, E> : Error<"">;
  error: E;
}[E["type"]];

type ExcludeArray<S extends TupleType, E extends ArrayType> = ExcludeTuples<
  S,
  Tuple<[], ArrayValues<E>>
>;

type ExcludeTuples<
  S extends TupleType,
  E extends TupleType,
  $C extends any[] = CrossTupleValues<
    TupleValues<S>,
    TupleValues<E>,
    IsOpen<S>,
    IsOpen<E>,
    OpenProps<S>,
    OpenProps<E>
  >,
  C extends CrossedValue[] = $C extends CrossedValue[] ? $C : [],
  $R extends any = RepresentableItems<C>,
  R extends CrossedValue[] = $R extends CrossedValue[] ? $R : [],
  P extends any = $Exclude<OpenProps<S>, OpenProps<E>>
> = P extends Type
  ? DoesTupleSizesMatch<S, E, C> extends true
    ? {
        moreThanTwo: S;
        onlyOne: Tuple<PropagateExclusion<C>, OpenProps<S>>;
        none: OmitOmittableItems<S, C>;
      }[And<IsOpen<S>, IsRepresentable<P>> extends true
        ? "moreThanTwo"
        : GetTupleLength<R>]
    : S
  : Error<"[ExcludeTuples] Exclude result does not extend Type">;

type CrossTupleValues<
  V1 extends Type[],
  V2 extends Type[],
  O1 extends boolean,
  O2 extends boolean,
  P1 extends Type,
  P2 extends Type,
  R extends any[] = []
> = {
  stop: L.Reverse<R>;
  continue1: CrossTupleValues<
    L.Tail<V1>,
    [],
    O1,
    O2,
    P1,
    P2,
    L.Prepend<R, CrossValue<L.Head<V1>, true, true, P2, O2, false>>
  >;
  continue2: CrossTupleValues<
    [],
    L.Tail<V2>,
    O1,
    O2,
    P1,
    P2,
    L.Prepend<R, CrossValue<P1, O1, false, L.Head<V2>, true, true>>
  >;
  continueBoth: CrossTupleValues<
    L.Tail<V1>,
    L.Tail<V2>,
    O1,
    O2,
    P1,
    P2,
    L.Prepend<R, CrossValue<L.Head<V1>, true, true, L.Head<V2>, true, true>>
  >;
}[V1 extends [any, ...L.List]
  ? V2 extends [any, ...L.List]
    ? "continueBoth"
    : "continue1"
  : V2 extends [any, ...L.List]
  ? "continue2"
  : "stop"];

// UTILS

type GetTupleLength<V extends any[], R extends any[] = L.Tail<V>> = A.Equals<
  V,
  []
> extends B.True
  ? "none"
  : A.Equals<R, []> extends B.True
  ? "onlyOne"
  : "moreThanTwo";

// SIZE CHECK

type DoesTupleSizesMatch<
  S extends TupleType,
  E extends TupleType,
  C extends CrossedValue[]
> = And<IsOpen<S>, Not<IsOpen<E>>> extends true
  ? false
  : And<IsExcludedSmallEnough<C>, IsExcludedBigEnough<C>>;

type IsExcludedSmallEnough<C extends CrossedValue[]> = {
  stop: true;
  continue: IsOutsideOfSourceScope<L.Head<C>> extends true
    ? false
    : IsExcludedSmallEnough<L.Tail<C>>;
}[C extends [any, ...L.List] ? "continue" : "stop"];

type IsExcludedBigEnough<C extends CrossedValue[]> = {
  stop: true;
  continue: IsOutsideOfExcludedScope<L.Head<C>> extends true
    ? false
    : IsExcludedBigEnough<L.Tail<C>>;
}[C extends [any, ...L.List] ? "continue" : "stop"];

// PROPAGATION

type RepresentableItems<C extends CrossedValue[], R extends any[] = []> = {
  stop: R;
  continue: IsExclusionValueRepresentable<L.Head<C>> extends true
    ? RepresentableItems<L.Tail<C>, L.Prepend<R, L.Head<C>>>
    : RepresentableItems<L.Tail<C>, R>;
}[C extends [any, ...L.List] ? "continue" : "stop"];

type PropagateExclusion<C extends CrossedValue[], R extends Type[] = []> = {
  stop: L.Reverse<R>;
  continue: PropagateExclusion<L.Tail<C>, L.Prepend<R, Propagate<L.Head<C>>>>;
}[C extends [any, ...L.List] ? "continue" : "stop"];

// OMITTABLE ITEMS

type OmitOmittableItems<
  S extends TupleType,
  C extends CrossedValue[],
  I extends any[] = OmittableItems<C>
> = {
  moreThanTwo: S;
  onlyOne: Tuple<RequiredTupleValues<C>, Never>;
  none: Never;
}[GetTupleLength<I>];

type OmittableItems<C extends CrossedValue[], R extends any[] = []> = {
  stop: R;
  continue: IsOmittable<L.Head<C>> extends true
    ? OmittableItems<L.Tail<C>, L.Prepend<R, L.Head<C>>>
    : OmittableItems<L.Tail<C>, R>;
}[C extends [any, ...L.List] ? "continue" : "stop"];

type RequiredTupleValues<C extends CrossedValue[], R extends Type[] = []> = {
  stop: L.Reverse<R>;
  continue: IsOmittable<L.Head<C>> extends true
    ? L.Reverse<R>
    : RequiredTupleValues<L.Tail<C>, L.Prepend<R, SourceValue<L.Head<C>>>>;
}[C extends [any, ...L.List] ? "continue" : "stop"];

// CONST

type ExcludeConst<
  S extends TupleType,
  E extends ConstType,
  V extends unknown = ConstValue<E>
> = V extends unknown[]
  ? ExtractConstValues<V> extends Type[]
    ? $Exclude<S, Tuple<ExtractConstValues<V>, Never>>
    : Error<"[ExcludeConst] ExtractConstValues result does not extend Type[]">
  : S;

type ExtractConstValues<V extends unknown[], R extends any[] = []> = {
  stop: L.Reverse<R>;
  continue: ExtractConstValues<L.Tail<V>, L.Prepend<R, Const<L.Head<V>>>>;
}[V extends [any, ...L.List] ? "continue" : "stop"];
