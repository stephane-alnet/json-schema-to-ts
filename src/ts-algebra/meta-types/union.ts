import { DoesExtend } from "../utils";

import { Error, Type } from ".";
import { Resolve } from "./resolve";
import { IsRepresentable } from "./isRepresentable";

export type UnionId = "union";

export type Union<V extends Type> = {
  type: UnionId;
  values: V;
};

export type $Union<V> = Union<
  V extends infer T
    ? T extends Type
      ? T
      : Error<"Type provided to $Union does not extend Meta.Type">
    : never
>;

export type UnionType = {
  type: UnionId;
  values: Type;
};

export type UnionValues<U extends UnionType> = U["values"];

export type ResolveUnion<U extends UnionType> = RecurseOnUnion<UnionValues<U>>;

type RecurseOnUnion<V extends Type> = V extends infer T
  ? T extends Type
    ? Resolve<T>
    : never
  : never;

export type IsUnionRepresentable<U extends UnionType> = DoesExtend<
  true,
  AreUnionValuesRepresentable<UnionValues<U>>
>;

type AreUnionValuesRepresentable<V extends Type> = V extends infer T
  ? T extends Type
    ? IsRepresentable<T>
    : never
  : never;
