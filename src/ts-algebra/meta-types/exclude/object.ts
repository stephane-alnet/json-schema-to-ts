import { A, B, U } from "ts-toolbelt";

import { And, Or, Not, DoesExtend, IsObject } from "../../utils";

import { Never, Error, Type } from "..";
import { Const, ConstValue, ConstType } from "../const";
import { EnumType } from "../enum";
import {
  Object,
  ObjectValues,
  Value,
  Required,
  IsOpen,
  OpenProps,
  ObjectType,
} from "../object";
import { UnionType } from "../union";
import { IsRepresentable } from "../isRepresentable";

import { $Exclude } from ".";
import { ExcludeEnum } from "./enum";
import { ExcludeUnion } from "./union";
import {
  CrossValue,
  SourceValue,
  IsExclusionValueRepresentable,
  IsOutsideOfSourceScope,
  IsOutsideOfExcludedScope,
  Propagate,
  IsOmittable,
  CrossedValue,
} from "./utils";

export type ExcludeFromObject<S extends ObjectType, E extends Type> = {
  any: Never;
  never: S;
  const: E extends ConstType ? ExcludeConst<S, E> : Error<"">;
  enum: E extends EnumType ? ExcludeEnum<S, E> : Error<"">;
  primitive: S;
  array: S;
  tuple: S;
  object: E extends ObjectType ? ExcludeObjects<S, E> : Error<"">;
  union: E extends UnionType ? ExcludeUnion<S, E> : Error<"">;
  error: E;
}[E["type"]];

type ExcludeObjects<
  S extends ObjectType,
  E extends ObjectType,
  $C extends any = CrossObjectValues<S, E>,
  C extends Record<A.Key, CrossedValue> = $C extends Record<A.Key, CrossedValue>
    ? $C
    : {},
  R extends A.Key = RepresentableKeys<C>,
  P extends any = $Exclude<OpenProps<S>, OpenProps<E>>
> = P extends Type
  ? DoesObjectSizesMatch<S, E, C> extends true
    ? {
        moreThanTwo: S;
        onlyOne: PropagateExclusion<S, C>;
        none: OmitOmittableKeys<S, C>;
      }[And<IsOpen<S>, IsRepresentable<P>> extends true
        ? "moreThanTwo"
        : GetUnionLength<R>]
    : S
  : Error<"[ExcludeObjects] Exclude result does not extend MetaType">;

type CrossObjectValues<S extends ObjectType, E extends ObjectType> = {
  [key in
    | keyof ObjectValues<S>
    | keyof ObjectValues<E>
    | Required<S>
    | Required<E>]: CrossValue<
    Value<S, key>,
    IsPossibleIn<S, key>,
    IsRequiredIn<S, key>,
    Value<E, key>,
    IsPossibleIn<E, key>,
    IsRequiredIn<E, key>
  >;
};

// UTILS

type GetUnionLength<Union extends any> = A.Equals<Union, never> extends B.True
  ? "none"
  : A.Equals<U.Pop<Union>, never> extends B.True
  ? "onlyOne"
  : "moreThanTwo";

type IsPossibleIn<O extends ObjectType, K extends A.Key> = Or<
  DoesExtend<K, keyof ObjectValues<O>>,
  IsOpen<O>
>;

type IsRequiredIn<O extends ObjectType, K extends A.Key> = DoesExtend<
  K,
  Required<O>
>;

// SIZE CHECK

type DoesObjectSizesMatch<
  S extends ObjectType,
  E extends ObjectType,
  C extends Record<A.Key, CrossedValue>
> = And<IsOpen<S>, Not<IsOpen<E>>> extends true
  ? false
  : And<IsExcludedSmallEnough<C>, IsExcludedBigEnough<C>>;

type IsExcludedSmallEnough<C extends Record<A.Key, CrossedValue>> = Not<
  DoesExtend<
    true,
    {
      [key in keyof C]: IsOutsideOfSourceScope<C[key]>;
    }[keyof C]
  >
>;

type IsExcludedBigEnough<C extends Record<A.Key, CrossedValue>> = Not<
  DoesExtend<
    true,
    {
      [key in keyof C]: IsOutsideOfExcludedScope<C[key]>;
    }[keyof C]
  >
>;

// PROPAGATION

type RepresentableKeys<C extends Record<string, CrossedValue>> = {
  [key in keyof C]: IsExclusionValueRepresentable<C[key]> extends true
    ? key
    : never;
}[keyof C];

type PropagateExclusion<
  S extends ObjectType,
  C extends Record<A.Key, CrossedValue>
> = Object<
  {
    [key in keyof C]: Propagate<C[key]>;
  },
  Required<S>,
  OpenProps<S>,
  IsOpen<S>
>;

// OMITTABLE KEYS

type OmitOmittableKeys<
  S extends ObjectType,
  C extends Record<string, CrossedValue>,
  K = OmittableKeys<C>
> = {
  moreThanTwo: S;
  onlyOne: Object<
    {
      [key in keyof C]: key extends K ? Never : SourceValue<C[key]>;
    },
    Required<S>,
    OpenProps<S>,
    IsOpen<S>
  >;
  none: Never;
}[GetUnionLength<K>];

type OmittableKeys<C extends Record<string, CrossedValue>> = {
  [key in keyof C]: IsOmittable<C[key]> extends true ? key : never;
}[keyof C];

// CONST

type ExcludeConst<
  S extends ObjectType,
  E extends ConstType,
  V extends any = ConstValue<E>
> = IsObject<V> extends true
  ? $Exclude<S, Object<{ [key in keyof V]: Const<V[key]> }, keyof V>>
  : S;
