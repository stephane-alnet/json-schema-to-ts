import { JSONSchema7TypeName } from "json-schema";
import { M } from "ts-algebra";
import { L } from "ts-toolbelt";

import { JSONSchema7 } from "definitions";

import { Intersection, Union, Error } from "../meta-types";
import { Get, HasKeyIn, Merge } from "../utils";

import { ParseSchema, ParseV7Schema } from ".";
import {
  MergeSubSchema,
  MergeSubSchema7,
  RemoveInvalidAdditionalItems,
} from "./utils";

export type ParseOneOfSchema<S, O = Get<S, "oneOf">> = O extends L.List
  ? Union<RecurseOnOneOfSchema<O, S>>
  : Error<"'oneOf' property should be an array">;

type RecurseOnOneOfSchema<S extends L.List, P, R = never> = {
  stop: R;
  continue: RecurseOnOneOfSchema<
    L.Tail<S>,
    P,
    | R
    | (HasKeyIn<P, "enum" | "const" | "type" | "anyOf"> extends true
        ? Intersection<
            ParseSchema<Omit<P, "oneOf">>,
            ParseSchema<MergeSubSchema<Omit<P, "oneOf">, L.Head<S>>>
          >
        : ParseSchema<
            Merge<Omit<P, "oneOf">, RemoveInvalidAdditionalItems<L.Head<S>>>
          >)
  >;
}[S extends [any, ...L.List] ? "continue" : "stop"];

// V7

export type ParseOneOfSchema7<S extends JSONSchema7> = S extends {
  oneOf: JSONSchema7[];
}
  ? M.$Union<RecurseOnAnyOfSchema7<S["oneOf"], S>>
  : M.Error<'[ParseOneOfSchema7] Unable to parse schema: "oneOf" keyword missing or invalid'>;

type RecurseOnAnyOfSchema7<
  S extends JSONSchema7[],
  P extends JSONSchema7,
  R extends unknown = never
> = {
  stop: R;
  continue: RecurseOnAnyOfSchema7<
    L.Tail<S>,
    P,
    | R
    | (P extends
        | { const: unknown }
        | { enum: unknown[] }
        | { type: JSONSchema7TypeName | JSONSchema7TypeName[] }
        | { anyOf: JSONSchema7[] }
        ? M.$Intersect<
            ParseV7Schema<Omit<P, "oneOf">>,
            ParseV7Schema<MergeSubSchema7<Omit<P, "oneOf">, L.Head<S>>>
          >
        : ParseV7Schema<MergeSubSchema7<Omit<P, "oneOf">, L.Head<S>>>)
  >;
}[S extends [JSONSchema7, ...JSONSchema7[]] ? "continue" : "stop"];
