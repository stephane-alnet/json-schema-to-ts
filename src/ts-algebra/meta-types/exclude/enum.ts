import { A, B, U } from "ts-toolbelt";

import { Never, Const, Error, Type } from "..";
import { Enum, EnumType, EnumValues } from "../enum";
import { UnionType } from "../union";
import { IntersectionType } from "../intersection";
import { Intersect } from "../intersect";
import { IsRepresentable } from "../isRepresentable";

import { $Exclude } from ".";
import { ExcludeUnion } from "./union";
import { ExcludeIntersection } from "./intersection";

export type ExcludeFromEnum<Source extends EnumType, Excluded extends Type> = {
  any: Never;
  never: Source;
  const: FilterExcluded<Source, Excluded>;
  enum: FilterExcluded<Source, Excluded>;
  boolean: FilterExcluded<Source, Excluded>;
  primitive: FilterExcluded<Source, Excluded>;
  array: FilterExcluded<Source, Excluded>;
  tuple: FilterExcluded<Source, Excluded>;
  object: FilterExcluded<Source, Excluded>;
  union: Excluded extends UnionType ? ExcludeUnion<Source, Excluded> : never;
  intersection: Excluded extends IntersectionType
    ? // @ts-expect-error
      ExcludeIntersection<Source, Excluded>
    : never;
  error: Excluded;
}[Excluded["type"]];

type FilterExcluded<SourceEnum extends EnumType, Excluded extends Type> = Enum<
  RecurseOnEnumValues<EnumValues<SourceEnum>, Excluded>
>;

type RecurseOnEnumValues<
  EnumValues extends unknown,
  Excluded extends Type
> = EnumValues extends infer EnumValue
  ? IsEnumValueRepresentable<EnumValue, Excluded> extends false
    ? never
    : EnumValue
  : never;

type IsEnumValueRepresentable<
  EnumValue extends unknown,
  Excluded extends Type,
  X extends any = $Exclude<Const<EnumValue>, Excluded>
> = X extends Type
  ? IsRepresentable<X>
  : Error<"[IsEnumValueRepresentable] Exclude result does not extend MetaType">;

export type ExcludeEnum<
  Source extends Type,
  ExcludedEnum extends EnumType,
  ExcludedEnumValues extends any = EnumValues<ExcludedEnum>
> = A.Equals<ExcludedEnumValues, never> extends B.True
  ? Source
  : ExcludeEnumValue<Source, U.Last<ExcludedEnumValues>, ExcludedEnumValues>;

type ExcludeEnumValue<
  Source extends Type,
  LastEnumValue extends any,
  ExcludedEnumValues extends any,
  X1 extends any = $Exclude<Source, Const<LastEnumValue>>,
  X2 extends any = $Exclude<
    Source,
    Enum<U.Exclude<ExcludedEnumValues, LastEnumValue>>
  >
> = X1 extends Type
  ? X2 extends Type
    ? Intersect<X1, X2>
    : Error<"[ExcludeEnumValue] Exclude result result does not extend Type">
  : Error<"[ExcludeEnumValue] Exclude result result does not extend Type">;
