import { JSONSchema7TypeName } from "json-schema";
import { M } from "ts-algebra";

import { JSONSchema7 } from "definitions";

import { Any, Primitive, Arr, Object, Union, Exclusion } from "../meta-types";
import { IsRepresentable } from "../meta-types/utils";

import { Get, HasKeyIn } from "../utils";

import { ParseSchema, ParseV7Schema } from ".";
import { MergeSubSchema, MergeSubSchema7 } from "./utils";

type AllTypes = Union<
  | Primitive<null>
  | Primitive<boolean>
  | Primitive<number>
  | Primitive<string>
  | Arr<Any>
  | Object
>;

export type ParseNotSchema<
  S,
  P = ParseSchema<Omit<S, "not">>,
  E = Exclusion<
    HasKeyIn<
      S,
      "enum" | "const" | "type" | "anyOf" | "oneOf" | "allOf"
    > extends true
      ? P
      : AllTypes,
    ParseSchema<MergeSubSchema<Omit<S, "not">, Get<S, "not">>>
  >
> = IsRepresentable<E> extends true ? E : P;

// V7

type AllTypes7 = M.Union<
  | M.Boolean
  | M.Primitive<null>
  | M.Primitive<number>
  | M.Primitive<string>
  | M.Array<M.Any>
  | M.Object<{}, never, M.Any>
>;

export type ParseNotSchema7<S extends JSONSchema7> = S extends {
  not: JSONSchema7;
}
  ? ExcludeNotSchema<S["not"], Omit<S, "not">>
  : M.Error<'[ParseNotSchema7] Unable to parse schema: "not" keyword missing or invalid'>;

type ExcludeNotSchema<
  N extends JSONSchema7,
  P extends JSONSchema7,
  E extends unknown = M.$Exclude<
    P extends
      | { const: unknown }
      | { enum: unknown[] }
      | { type: JSONSchema7TypeName | JSONSchema7TypeName[] }
      | { anyOf: JSONSchema7[] }
      | { oneOf: JSONSchema7[] }
      | { allOf: JSONSchema7[] }
      ? ParseV7Schema<P>
      : AllTypes7,
    ParseV7Schema<MergeSubSchema7<P, N>>
  >
> = M.$IsRepresentable<E> extends true ? E : P;
