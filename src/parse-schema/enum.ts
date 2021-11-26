import { JSONSchema7TypeName } from "json-schema";
import { M } from "ts-algebra";

import { JSONSchema7 } from "definitions";

import { Enum, Intersection } from "../meta-types";
import { DeepGet, HasKeyIn } from "../utils";

import { ParseSchema, ParseV7Schema } from ".";

export type ParseEnumSchema<S> = HasKeyIn<S, "const" | "type"> extends true
  ? Intersection<
      Enum<DeepGet<S, ["enum", number]>>,
      ParseSchema<Omit<S, "enum">>
    >
  : Enum<DeepGet<S, ["enum", number]>>;

// V7

export type ParseEnumSchema7<S extends JSONSchema7> = S extends {
  enum: unknown[];
}
  ? S extends
      | { const: unknown }
      | { type: JSONSchema7TypeName | JSONSchema7TypeName[] }
    ? M.$Intersect<M.Enum<S["enum"][number]>, ParseV7Schema<Omit<S, "enum">>>
    : M.Enum<S["enum"][number]>
  : M.Error<'[ParseEnumSchema7] Unable to parse schema: "enum" keyword missing or invalid'>;
