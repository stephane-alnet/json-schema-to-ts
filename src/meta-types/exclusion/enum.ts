import { A, U } from "ts-toolbelt";

import { Get } from "../../utils";

import { MetaType, Never, Const, Error } from "..";
import { Enum, Values } from "../enum";
import { Intersect } from "../intersection";
import { IsRepresentable } from "../utils";

import { Exclude } from ".";
import { ExcludeUnion } from "./union";
import { ExcludeIntersection } from "./intersection";
import { ExcludeExclusion } from "./exclusion";

export type ExcludeFromEnum<Source, Excluded> = {
  any: Never;
  never: Source;
  const: FilterExcluded<Source, Excluded>;
  enum: FilterExcluded<Source, Excluded>;
  primitive: FilterExcluded<Source, Excluded>;
  brandedPrimitive: FilterExcluded<Source, Excluded>;
  array: FilterExcluded<Source, Excluded>;
  tuple: FilterExcluded<Source, Excluded>;
  object: FilterExcluded<Source, Excluded>;
  union: ExcludeUnion<Source, Excluded>;
  intersection: ExcludeIntersection<Source, Excluded>;
  exclusion: ExcludeExclusion<Source, Excluded>;
  error: Excluded;
  errorTypeProperty: Error<"Missing type property">;
}[Get<Excluded, "type"> extends MetaType
  ? Get<Excluded, "type">
  : "errorTypeProperty"];

type FilterExcluded<SourceEnum, Excluded> = Enum<
  RecurseOnEnumValues<Values<SourceEnum>, Excluded>
>;

type RecurseOnEnumValues<
  EnumValues,
  Excluded
> = EnumValues extends infer EnumValue
  ? IsRepresentable<Exclude<Const<EnumValue>, Excluded>> extends false
    ? never
    : EnumValue
  : never;

export type ExcludeEnum<
  Source,
  ExcludedEnum,
  ExcludedEnumValues = Values<ExcludedEnum>
> = A.Equals<ExcludedEnumValues, never> extends 1
  ? Source
  : ExcludeEnumValue<Source, U.Last<ExcludedEnumValues>, ExcludedEnumValues>;

type ExcludeEnumValue<Source, LastEnumValue, ExcludedEnumValues> = Intersect<
  Exclude<Source, Const<LastEnumValue>>,
  Exclude<Source, Enum<U.Exclude<ExcludedEnumValues, LastEnumValue>>>
>;
