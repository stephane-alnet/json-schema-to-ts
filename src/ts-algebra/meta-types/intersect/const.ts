import { A } from "ts-toolbelt";

import { IsObject } from "../../utils";

import { Never, Error, Type } from "..";
import { Const, ConstValue, ConstType } from "../const";
import {
  ObjectValues,
  Required,
  IsOpen,
  OpenProps,
  ObjectType,
} from "../object";
import { UnionType } from "../union";
import { Resolve } from "../resolve";

import { Intersect } from ".";
import { IntersectUnion } from "./union";

export type IntersectConst<A extends ConstType, B extends Type> = {
  any: A;
  never: Never;
  const: CheckExtendsResolved<A, B>;
  enum: CheckExtendsResolved<A, B>;
  primitive: CheckExtendsResolved<A, B>;
  array: CheckExtendsResolved<A, B>;
  tuple: CheckExtendsResolved<A, B>;
  object: B extends ObjectType ? ToObject<A, B> : Error<"">;
  union: B extends UnionType ? IntersectUnion<B, A> : Error<"">;
  error: B;
}[B["type"]];

type CheckExtendsResolved<
  A extends ConstType,
  B extends Type
> = ConstValue<A> extends Resolve<B> ? A : Never;

type ToObject<A extends ConstType, B extends ObjectType> = IsObject<
  ConstValue<A>
> extends true
  ? IntersectConstToObject<A, B>
  : Never;

type IntersectConstToObject<
  A extends ConstType,
  B extends ObjectType,
  $V extends Record<A.Key, any> = IntersectConstValues<
    ConstValue<A> extends Record<string, any> ? ConstValue<A> : never,
    B
  >,
  V extends Record<A.Key, Type> = $V extends Record<A.Key, Type>
    ? $V
    : {
        error: Error<"[IntersectConstToObject] IntersectConstValues result does not extend MetaType">;
      }
> = NeverKeys<V> extends never ? A : Never;

type IntersectConstValues<
  V extends Record<string, any>,
  B extends ObjectType
> = {
  [key in keyof V | Required<B>]: key extends keyof V
    ? key extends keyof ObjectValues<B>
      ? Intersect<Const<V[key]>, ObjectValues<B>[key]>
      : IsOpen<B> extends true
      ? Intersect<Const<V[key]>, OpenProps<B>>
      : Never
    : Never;
};

/**
 * @debt "TODO: Use IsRepresentable ?"
 */
type NeverKeys<O extends Record<A.Key, Type>> = {
  [key in keyof O]: O[key] extends Never ? key : never;
}[keyof O];
