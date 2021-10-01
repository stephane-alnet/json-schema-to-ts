import { A } from "ts-toolbelt";

import { Never, Error, Type } from "..";
import { ConstType } from "../const";
import { EnumType } from "../enum";
import {
  Object,
  ObjectValues,
  Required,
  IsOpen,
  OpenProps,
  ObjectType,
} from "../object";
import { UnionType } from "../union";
import { IsRepresentable } from "../isRepresentable";

import { Intersect } from ".";
import { IntersectConst } from "./const";
import { IntersectEnum } from "./enum";
import { DistributeIntersection } from "./union";

export type IntersectObject<A extends ObjectType, B extends Type> = {
  any: A;
  never: Never;
  const: B extends ConstType ? IntersectConst<B, A> : Error<"">;
  enum: B extends EnumType ? IntersectEnum<B, A> : Error<"">;
  primitive: Never;
  array: Never;
  tuple: Never;
  object: B extends ObjectType ? IntersectObjects<A, B> : Error<"">;
  union: B extends UnionType ? DistributeIntersection<B, A> : Error<"">;
  error: B;
}[B["type"]];

type IntersectObjects<
  A extends ObjectType,
  B extends ObjectType,
  $C extends any = IntersectObjectsValues<A, B>,
  C extends Record<A.Key, Type> = $C extends Record<A.Key, Type>
    ? $C
    : {
        error: Error<"[IntersectObjects] IntersectObjectsValues result does not extend MetaType">;
      },
  N extends A.Key = NonRepresentableKeys<C>,
  $V extends any = {
    [key in Exclude<keyof C, N>]: C[key];
  },
  V extends Record<A.Key, Type> = $V extends Record<A.Key, Type>
    ? $V
    : {
        error: Error<"[IntersectObjects] IntersectObjectsValues result does not extend MetaType">;
      },
  /**
   * @debt "TODO: Define $O to cast as Type"
   */
  O extends any = IntersectOpenProps<A, B>
> = Required<A> | Required<B> extends Exclude<Required<A> | Required<B>, N>
  ? Object<
      V,
      Required<A> | Required<B>,
      O extends Type
        ? O
        : Error<"[IntersectObjects] IntersectOpenProps result does not extend MetaType">
    >
  : Never;

type IntersectObjectsValues<A extends ObjectType, B extends ObjectType> = {
  [key in
    | keyof ObjectValues<A>
    | keyof ObjectValues<B>]: key extends keyof ObjectValues<A>
    ? key extends keyof ObjectValues<B>
      ? Intersect<ObjectValues<A>[key], ObjectValues<B>[key]>
      : IsOpen<B> extends true
      ? Intersect<ObjectValues<A>[key], OpenProps<B>>
      : Never
    : key extends keyof ObjectValues<B>
    ? IsOpen<A> extends true
      ? Intersect<OpenProps<A>, ObjectValues<B>[key]>
      : Never
    : Never;
};

type NonRepresentableKeys<O extends Record<A.Key, Type>> = {
  /**
   * @debt "TODO: Use IsRepresentable ?"
   */
  [key in keyof O]: IsRepresentable<O[key]> extends false ? key : never;
}[keyof O];

type IntersectOpenProps<A extends ObjectType, B extends ObjectType> = Intersect<
  OpenProps<A>,
  OpenProps<B>
>;
