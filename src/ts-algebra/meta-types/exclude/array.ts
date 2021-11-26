import { A, B } from "ts-toolbelt";

import { And, DoesExtend } from "../../utils";

import { Never, Const, Error, Type } from "..";
import { $Array, ArrayType, ArrayValues } from "../array";
import { TupleValues, IsOpen, OpenProps, TupleType } from "../tuple";
import { UnionType } from "../union";
import { IntersectionType } from "../intersection";
import { IsRepresentable } from "../isRepresentable";

import { $Exclude } from ".";
import { ExcludeUnion } from "./union";
import { ExcludeIntersection } from "./intersection";

export type ExcludeFromArray<
  Source extends ArrayType,
  Excluded extends Type
> = {
  any: Never;
  never: Source;
  const: Source;
  enum: Source;
  boolean: Source;
  primitive: Source;
  array: Excluded extends ArrayType ? ExcludeArray<Source, Excluded> : never;
  tuple: Excluded extends TupleType ? ExcludeTuple<Source, Excluded> : never;
  object: Source;
  union: Excluded extends UnionType ? ExcludeUnion<Source, Excluded> : never;
  intersection: Excluded extends IntersectionType
    ? // @ts-expect-error
      ExcludeIntersection<Source, Excluded>
    : never;
  error: Excluded;
}[Excluded["type"]];

type ExcludeArray<
  Source extends ArrayType,
  Excluded extends ArrayType,
  ExcludedValues extends any = $Exclude<
    ArrayValues<Source>,
    ArrayValues<Excluded>
  >
> = ExcludedValues extends Type
  ? IsRepresentable<ExcludedValues> extends true
    ? Source
    : Const<[]>
  : Error<"[ExcludeArray] Exclude result does not extend MetaType">;

type ExcludeTuple<Source extends ArrayType, Excluded extends TupleType> = And<
  DoesExtend<A.Equals<TupleValues<Excluded>, []>, B.True>,
  IsOpen<Excluded>
> extends true
  ? ExcludeArray<Source, $Array<OpenProps<Excluded>>>
  : Source;
