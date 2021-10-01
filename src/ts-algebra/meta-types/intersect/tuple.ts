import { L } from "ts-toolbelt";

import { Never, Tuple, Error, Type } from "..";
import { ConstType } from "../const";
import { EnumType } from "../enum";
import { ArrayValues, ArrayType } from "../array";
import { TupleValues, IsOpen, OpenProps, TupleType } from "../tuple";
import { UnionType } from "../union";
import { IsRepresentable } from "../isRepresentable";

import { Intersect } from ".";
import { IntersectConst } from "./const";
import { IntersectEnum } from "./enum";
import { DistributeIntersection } from "./union";

export type IntersectTuple<A extends TupleType, B extends Type> = {
  any: A;
  never: Never;
  const: B extends ConstType ? IntersectConst<B, A> : Error<"">;
  enum: B extends EnumType ? IntersectEnum<B, A> : Error<"">;
  primitive: Never;
  array: B extends ArrayType ? IntersectTupleToArray<A, B> : Error<"">;
  tuple: B extends TupleType ? IntersectTuples<A, B> : Error<"">;
  object: Never;
  union: B extends UnionType ? DistributeIntersection<B, A> : Error<"">;
  error: B;
}[B["type"]];

type IntersectTupleToArray<
  T extends TupleType,
  A extends ArrayType,
  I extends any[] = IntersectTupleToArrayValues<TupleValues<T>, ArrayValues<A>>,
  V extends Type[] = I extends Type[]
    ? I
    : [
        Error<"[IntersectTupleToArray] IntersectTupleToArrayValues result does not extend MetaType">
      ],
  N extends boolean = HasNonRepresentableValue<V>,
  /**
   * @debt "TODO: Define $O to cast as Type"
   */
  O extends any = Intersect<OpenProps<T>, ArrayValues<A>>
> = N extends true
  ? Never
  : O extends Type
  ? Tuple<V, O>
  : Error<"[IntersectTupleToArray] Intersect result does not extend MetType">;

type IntersectTupleToArrayValues<
  V extends Type[],
  T extends Type,
  R extends any[] = []
> = {
  stop: L.Reverse<R>;
  continue: IntersectTupleToArrayValues<
    L.Tail<V>,
    T,
    L.Prepend<R, Intersect<L.Head<V>, T>>
  >;
}[V extends [any, ...L.List] ? "continue" : "stop"];

type HasNonRepresentableValue<V extends Type[], R extends boolean = false> = {
  stop: R;
  continue: IsRepresentable<L.Head<V>> extends false
    ? true
    : HasNonRepresentableValue<L.Tail<V>>;
}[V extends [any, ...L.List] ? "continue" : "stop"];

type IntersectTuples<
  A extends TupleType,
  B extends TupleType,
  $V extends any[] = IntersectTupleValues<
    TupleValues<A>,
    TupleValues<B>,
    IsOpen<A>,
    IsOpen<B>,
    OpenProps<A>,
    OpenProps<B>
  >,
  V extends Type[] = $V extends Type[]
    ? $V
    : [
        Error<"[IntersectTuples] IntersectTupleValues result does not extend MetaType">
      ],
  N extends boolean = HasNonRepresentableValue<V>,
  /**
   * @debt "TODO: Define $O to cast as Type"
   */
  O extends any = Intersect<OpenProps<A>, OpenProps<B>>
> = N extends true
  ? Never
  : O extends Type
  ? Tuple<V, O>
  : Error<"[IntersectTuples] Intersect result does not extend MetaType">;

type IntersectTupleValues<
  V1 extends Type[],
  V2 extends Type[],
  O1 extends boolean,
  O2 extends boolean,
  P1 extends Type,
  P2 extends Type,
  R extends any[] = []
> = {
  stop: L.Reverse<R>;
  continue1: IntersectTupleValues<
    L.Tail<V1>,
    V2,
    O1,
    O2,
    P1,
    P2,
    L.Prepend<R, O2 extends true ? Intersect<L.Head<V1>, P2> : Never>
  >;
  continue2: IntersectTupleValues<
    V1,
    L.Tail<V2>,
    O1,
    O2,
    P1,
    P2,
    L.Prepend<R, O1 extends true ? Intersect<L.Head<V2>, P1> : Never>
  >;
  continueBoth: IntersectTupleValues<
    L.Tail<V1>,
    L.Tail<V2>,
    O1,
    O2,
    P1,
    P2,
    L.Prepend<R, Intersect<L.Head<V1>, L.Head<V2>>>
  >;
}[V1 extends [any, ...L.List]
  ? V2 extends [any, ...L.List]
    ? "continueBoth"
    : "continue1"
  : V2 extends [any, ...L.List]
  ? "continue2"
  : "stop"];
