import { A, O } from "ts-toolbelt";

import { IsObject } from "../../utils";

import { Never, Error, Type } from "..";
import { Const, ConstType, ConstValue } from "../const";
import {
  ObjectValues,
  Required,
  IsOpen,
  OpenProps,
  ObjectType,
} from "../object";
import { UnionType } from "../union";
import { IntersectionType } from "../intersection";
import { IsRepresentable } from "../isRepresentable";
import { Resolve } from "../resolve";

import { $Exclude } from ".";
import { ExcludeUnion } from "./union";
import { ExcludeIntersection } from "./intersection";

export type ExcludeFromConst<
  Source extends ConstType,
  Excluded extends Type
> = {
  any: Never;
  never: Source;
  const: CheckNotExtendsResolved<Source, Excluded>;
  enum: CheckNotExtendsResolved<Source, Excluded>;
  boolean: CheckNotExtendsResolved<Source, Excluded>;
  primitive: CheckNotExtendsResolved<Source, Excluded>;
  array: CheckNotExtendsResolved<Source, Excluded>;
  tuple: CheckNotExtendsResolved<Source, Excluded>;
  object: Excluded extends ObjectType ? ExcludeObject<Source, Excluded> : never;
  union: Excluded extends UnionType ? ExcludeUnion<Source, Excluded> : never;
  intersection: Excluded extends IntersectionType
    ? // @ts-expect-error
      ExcludeIntersection<Source, Excluded>
    : never;
  error: Excluded;
}[Excluded["type"]];

type CheckNotExtendsResolved<
  Source extends ConstType,
  Excluded extends Type
> = ConstValue<Source> extends Resolve<Excluded> ? Never : Source;

type ExcludeObject<
  Source extends ConstType,
  Excluded extends ObjectType
> = IsObject<ConstValue<Source>> extends true
  ? Required<Excluded> extends keyof ConstValue<Source>
    ? ExcludeObjectFromConst<Source, Excluded>
    : Source
  : Source;

type ExcludeObjectFromConst<
  Source extends ConstType,
  Excluded extends ObjectType,
  ExcludedValues extends any = ConstValue<Source> extends O.Object
    ? ExcludeConstValues<ConstValue<Source>, Excluded>
    : Error<"[ExcludeObjectFromConst] ConstValue does not extend O.Object">
> = ExcludedValues extends Record<A.Key, Type>
  ? RepresentableKeys<ExcludedValues> extends never
    ? Never
    : Source
  : Error<"[ExcludeObjectFromConst] ExcludeConstValues result result does not extend Record<string, Type>">;

type ExcludeConstValues<
  SourceValue extends O.Object,
  Excluded extends ObjectType
> = {
  [key in keyof SourceValue]: key extends keyof ObjectValues<Excluded>
    ? $Exclude<Const<SourceValue[key]>, ObjectValues<Excluded>[key]>
    : IsOpen<Excluded> extends true
    ? $Exclude<Const<SourceValue[key]>, OpenProps<Excluded>>
    : Const<SourceValue[key]>;
};

type RepresentableKeys<O extends Record<A.Key, Type>> = {
  [key in keyof O]: IsRepresentable<O[key]> extends true ? key : never;
}[keyof O];
