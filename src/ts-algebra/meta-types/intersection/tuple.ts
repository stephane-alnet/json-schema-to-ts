import { L } from "ts-toolbelt";

import { Type } from "..";
import { Tuple, TupleType, TupleValues, OpenProps } from "../tuple";
import { Error } from "../error";

import { ClearIntersections } from ".";

export type ClearTupleIntersections<
  T extends TupleType,
  $V = ClearTupleValuesIntersections<TupleValues<T>>,
  V extends Type[] = $V extends Type[]
    ? $V
    : [
        Error<"[ClearTupleIntersections] ClearTupleValuesIntersections result does not extend MetaType[]">
      ],
  $O = ClearIntersections<OpenProps<T>>,
  O extends Type = $O extends Type
    ? $O
    : Error<"[ClearTupleIntersections] ClearIntersections result does not extend MetaType">
> = Tuple<V, O>;

type ClearTupleValuesIntersections<V extends Type[], R extends any[] = []> = {
  stop: L.Reverse<R>;
  continue: ClearTupleValuesIntersections<
    L.Tail<V>,
    L.Prepend<R, ClearIntersections<L.Head<V>>>
  >;
}[V extends [any, ...L.List] ? "continue" : "stop"];
