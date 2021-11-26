import { JSONSchema7 } from "definitions";
import { M } from "ts-algebra";

import { Const, Intersection } from "../meta-types";
import { Get, HasKeyIn } from "../utils";

import { ParseSchema, ParseV7Schema } from ".";
import { JSONSchema7TypeName } from "json-schema";

export type ParseConstSchema<S> = HasKeyIn<S, "type"> extends true
  ? Intersection<Const<Get<S, "const">>, ParseSchema<Omit<S, "const">>>
  : Const<Get<S, "const">>;

// V7

export type ParseConstSchema7<S extends JSONSchema7> = S extends {
  const: unknown;
}
  ? S extends { type: JSONSchema7TypeName | JSONSchema7TypeName[] }
    ? M.$Intersect<M.Const<S["const"]>, ParseV7Schema<Omit<S, "const">>>
    : M.Const<S["const"]>
  : M.Error<'[ParseConstSchema7] Unable to parse schema: "const" keyword missing or invalid'>;
