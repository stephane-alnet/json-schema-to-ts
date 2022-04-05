import { Primitive, BrandedPrimitive, Any, Never } from "../meta-types";

import { ParseConstSchema } from "./const";
import { ParseEnumSchema } from "./enum";
import { ParseMixedSchema } from "./mixed";
import { ParseArrSchema } from "./array";
import { ParseObjectSchema } from "./object";
import { ParseAnyOfSchema } from "./anyOf";
import { ParseOneOfSchema } from "./oneOf";
import { ParseAllOfSchema } from "./allOf";
import { ParseNotSchema } from "./not";
import { ParseIfThenElseSchema } from "./ifThenElse";
import { ParseNullableSchema } from './nullable';

export type ParseSchema<S> = {
  any: Any;
  never: Never;
  null: Primitive<null>;
  boolean: Primitive<boolean>;
  number: Primitive<number>;
  string: Primitive<string>;
  brandedString: BrandedPrimitive<string,Get<S,"x-brand">>
  mixed: ParseMixedSchema<S>;
  object: ParseObjectSchema<S>;
  array: ParseArrSchema<S>;
  const: ParseConstSchema<S>;
  enum: ParseEnumSchema<S>;
  anyOf: ParseAnyOfSchema<S>;
  oneOf: ParseOneOfSchema<S>;
  allOf: ParseAllOfSchema<S>;
  not: ParseNotSchema<S>;
  nullable: ParseNullableSchema<S>;
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
  : "nullable" extends keyof S
  ? S["nullable"] extends true
    ? "nullable"
    : InferType<S>
  : InferType<S>;

type InferType<S> =
  "type" extends keyof S
  ? S["type"] extends any[]
    ? "mixed"
    : S["type"] extends "null"
    ? "null"
    : S["type"] extends "boolean"
    ? "boolean"
    : S["type"] extends "integer" | "number"
    ? "number"
    : S["type"] extends "string"
    ? ( "x-brand" extends keyof S ? 'brandedString' : "string")
    : S["type"] extends "object"
    ? "object"
    : S["type"] extends "array"
    ? "array"
    : "never"
  : "any";
