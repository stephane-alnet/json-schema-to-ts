import { M } from "ts-algebra";

import { JSONSchema7 } from "definitions";
import { Primitive, Any, Never } from "../meta-types";

import { ParseMixedSchema, ParseMixedSchema7 } from "./mixed";
import { ParseConstSchema, ParseConstSchema7 } from "./const";
import { ParseEnumSchema, ParseEnumSchema7 } from "./enum";
import { ParseArrSchema, ParseArraySchema7 } from "./array";
import { ParseObjectSchema, ParseObjectSchema7 } from "./object";
import { ParseAnyOfSchema, ParseAnyOfSchema7 } from "./anyOf";
import { ParseOneOfSchema, ParseOneOfSchema7 } from "./oneOf";
import { ParseAllOfSchema, ParseAllOfSchema7 } from "./allOf";
import {
  ParseNotSchema,
  // ParseNotSchema7
} from "./not";
import {
  ParseIfThenElseSchema,
  // ParseIfThenElseSchema7
} from "./ifThenElse";

export type ParseSchema<S> = {
  any: Any;
  never: Never;
  null: Primitive<null>;
  boolean: Primitive<boolean>;
  number: Primitive<number>;
  string: Primitive<string>;
  mixed: ParseMixedSchema<S>;
  object: ParseObjectSchema<S>;
  array: ParseArrSchema<S>;
  const: ParseConstSchema<S>;
  enum: ParseEnumSchema<S>;
  anyOf: ParseAnyOfSchema<S>;
  oneOf: ParseOneOfSchema<S>;
  allOf: ParseAllOfSchema<S>;
  not: ParseNotSchema<S>;
  ifThenElse: ParseIfThenElseSchema<S>;
}[InferSchemaType<S>];

type InferSchemaType<S> = S extends true | string
  ? "any"
  : S extends false
  ? "never"
  : "if" extends keyof S
  ? "ifThenElse"
  : "not" extends keyof S
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

// V7

export type ParseV7Schema<S extends JSONSchema7> = {
  any: M.Any;
  never: M.Never;
  null: M.Primitive<null>;
  boolean: M.Boolean;
  number: M.Primitive<number>;
  string: M.Primitive<string>;
  mixed: ParseMixedSchema7<S>;
  const: ParseConstSchema7<S>;
  enum: ParseEnumSchema7<S>;
  array: ParseArraySchema7<S>;
  object: ParseObjectSchema7<S>;
  anyOf: ParseAnyOfSchema7<S>;
  oneOf: ParseOneOfSchema7<S>;
  allOf: ParseAllOfSchema7<S>;
  // not: ParseNotSchema7<S>;
  // ifThenElse: ParseIfThenElseSchema7<S>;
}[InferSchema7Type<S>];

type InferSchema7Type<S extends JSONSchema7> =
  //  "if" extends keyof S
  // ? "ifThenElse"
  // : "not" extends keyof S
  // ? "not"
  "allOf" extends keyof S
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
