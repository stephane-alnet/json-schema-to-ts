import { L } from "ts-toolbelt";

import { Never, Error, Type } from ".";
import { IsRepresentable } from "./isRepresentable";
import { Resolve } from "./resolve";

export type TupleId = "tuple";

export type Tuple<
  V extends Type[] = [],
  P extends Type = Never,
  $O extends any = IsRepresentable<P>,
  O extends boolean = $O extends boolean ? $O : false
> = {
  type: TupleId;
  values: V;
  openProps: P;
  isOpen: O;
};

export type $Tuple<V = [], P = Never> = V extends Type[]
  ? P extends Type
    ? Tuple<V, P>
    : Error<"Second Type argument provided to $Tuple does not extend Meta.Type">
  : Error<"First Type argument provided to $Tuple does not extend Meta.Type[]">;

export type TupleType = {
  type: TupleId;
  values: Type[];
  openProps: Type;
  isOpen: boolean;
};

export type TupleValues<T extends TupleType> = T["values"];

export type OpenProps<T extends TupleType> = T["openProps"];

export type IsOpen<T extends TupleType> = T["isOpen"];

export type ResolveTuple<T extends TupleType> = IsOpen<T> extends true
  ? L.Concat<RecurseOnTuple<TupleValues<T>>, [...Resolve<OpenProps<T>>[]]>
  : RecurseOnTuple<TupleValues<T>>;

type RecurseOnTuple<V extends Type[], R extends L.List = []> = {
  stop: L.Reverse<R>;
  continue: RecurseOnTuple<L.Tail<V>, L.Prepend<R, Resolve<L.Head<V>>>>;
}[V extends [any, ...L.List] ? "continue" : "stop"];

export type IsTupleRepresentable<T extends TupleType> =
  AreAllTupleValuesRepresentable<TupleValues<T>>;

type AreAllTupleValuesRepresentable<V extends Type[]> = {
  stop: true;
  continue: IsRepresentable<L.Head<V>> extends false
    ? false
    : AreAllTupleValuesRepresentable<L.Tail<V>>;
}[V extends [any, ...L.List] ? "continue" : "stop"];
