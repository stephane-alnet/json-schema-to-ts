import { M } from "ts-algebra";

import { JSONSchema7 } from "definitions";

import { ParseConstSchema } from "./const";
import { ParseEnumSchema } from "./enum";
import { ParseMixedSchema } from "./mixed";
import { ParseArraySchema } from "./array";
import { ParseObjectSchema } from "./object";
import { ParseAnyOfSchema } from "./anyOf";
import { ParseOneOfSchema } from "./oneOf";
import { ParseAllOfSchema } from "./allOf";
import { ParseNotSchema } from "./not";
// import { ParseIfThenElseSchema } from "./ifThenElse";

export type ParseSchema<S extends boolean | JSONSchema7> = S extends JSONSchema7
  ? ParseRegularSchema<S>
  : S extends boolean
  ? ParseBooleanSchema<S>
  : M.Error<"">;

type ParseBooleanSchema<S extends boolean> = S extends true
  ? M.Any
  : S extends false
  ? M.Never
  : M.Error<"">;

type ParseRegularSchema<S extends JSONSchema7> = {
  any: M.Any;
  never: M.Never;
  const: ParseConstSchema<S>;
  enum: ParseEnumSchema<S>;
  null: M.Primitive<null>;
  boolean: M.Primitive<boolean>;
  number: M.Primitive<number>;
  string: M.Primitive<string>;
  mixed: ParseMixedSchema<S>;
  array: ParseArraySchema<S>;
  // @ts-expect-error
  object: ParseObjectSchema<S>;
  anyOf: ParseAnyOfSchema<S>;
  oneOf: ParseOneOfSchema<S>;
  allOf: ParseAllOfSchema<S>;
  // @ts-expect-error
  not: ParseNotSchema<S>;
  // ifThenElse: ParseIfThenElseSchema<S>;
}[InferSchemaType<S>];

type InferSchemaType<S extends JSONSchema7> =
  // "if" extends keyof S
  //   ? "ifThenElse"
  //   :
  "not" extends keyof S
    ? "not"
    : "allOf" extends keyof S
    ? "allOf"
    : "oneOf" extends keyof S
    ? "oneOf"
    : "anyOf" extends keyof S
    ? "anyOf"
    : "enum" extends keyof S
    ? "enum"
    : "const" extends keyof S
    ? "const"
    : "type" extends keyof S
    ? S["type"] extends any[]
      ? "mixed"
      : S["type"] extends "null"
      ? "null"
      : S["type"] extends "boolean"
      ? "boolean"
      : S["type"] extends "integer" | "number"
      ? "number"
      : S["type"] extends "string"
      ? "string"
      : S["type"] extends "object"
      ? "object"
      : S["type"] extends "array"
      ? "array"
      : "never"
    : "any";
