import { JSONSchema7TypeName } from "json-schema";
import { L } from "ts-toolbelt";
import { M } from "ts-algebra";

import { JSONSchema7 } from "definitions";

import { Union, Error } from "../meta-types";
import { Get, DeepMergeUnsafe } from "../utils";

import { ParseSchema, ParseV7Schema } from ".";

export type ParseMixedSchema<S, T = Get<S, "type">> = T extends L.List
  ? Union<RecurseOnMixedSchema<T, S>>
  : Error<"Mixed schema 'type' property should be an array">;

type RecurseOnMixedSchema<T extends L.List, S, R = never> = {
  stop: R;
  continue: RecurseOnMixedSchema<
    L.Tail<T>,
    S,
    R | ParseSchema<DeepMergeUnsafe<S, { type: L.Head<T> }>>
  >;
}[T extends [any, ...L.List] ? "continue" : "stop"];

// V7

export type ParseMixedSchema7<S extends JSONSchema7> = S extends {
  type: JSONSchema7TypeName[];
}
  ? M.$Union<RecurseOnMixedSchema7<S["type"], S>>
  : M.Error<'[ParseMixedSchema7] Unable to parse schema: "type" keyword missing or invalid'>;

type RecurseOnMixedSchema7<
  T extends JSONSchema7TypeName[],
  S extends JSONSchema7,
  R = never
> = {
  stop: R;
  continue: RecurseOnMixedSchema7<
    L.Tail<T>,
    S,
    R | ParseV7Schema<Omit<S, "type"> & { type: L.Head<T> }>
  >;
}[T extends [JSONSchema7TypeName, ...JSONSchema7TypeName[]]
  ? "continue"
  : "stop"];
