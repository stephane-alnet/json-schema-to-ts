import { JSONSchema7TypeName } from "json-schema";
import { L } from "ts-toolbelt";
import { M } from "ts-algebra";

import { JSONSchema7 } from "definitions";

import { Intersection, Union } from "../meta-types";
import { Get, HasKeyIn, Merge } from "../utils";

import { ParseSchema, ParseV7Schema } from ".";
import {
  MergeSubSchema,
  MergeSubSchema7,
  RemoveInvalidAdditionalItems,
} from "./utils";

export type ParseAnyOfSchema<S> = Union<
  RecurseOnAnyOfSchema<Get<S, "anyOf">, S>
>;

type RecurseOnAnyOfSchema<S, P, R = never> = {
  stop: R;
  // 🔧 TOIMPROVE: Not cast here
  continue: S extends L.List
    ? RecurseOnAnyOfSchema<
        L.Tail<S>,
        P,
        | R
        | (HasKeyIn<P, "enum" | "const" | "type"> extends true
            ? Intersection<
                ParseSchema<Omit<P, "anyOf">>,
                ParseSchema<MergeSubSchema<Omit<P, "anyOf">, L.Head<S>>>
              >
            : ParseSchema<
                Merge<Omit<P, "anyOf">, RemoveInvalidAdditionalItems<L.Head<S>>>
              >)
      >
    : never;
}[S extends [any, ...L.List] ? "continue" : "stop"];

// V7

export type ParseAnyOfSchema7<S extends JSONSchema7> = S extends {
  anyOf: JSONSchema7[];
}
  ? M.$Union<RecurseOnAnyOfSchema7<S["anyOf"], S>>
  : M.Error<'[ParseAnyOfSchema7] Unable to parse schema: "anyOf" keyword missing or invalid'>;

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
        ? M.$Intersect<
            ParseV7Schema<Omit<P, "anyOf">>,
            ParseV7Schema<MergeSubSchema7<Omit<P, "anyOf">, L.Head<S>>>
          >
        : ParseV7Schema<MergeSubSchema7<Omit<P, "anyOf">, L.Head<S>>>)
  >;
}[S extends [JSONSchema7, ...JSONSchema7[]] ? "continue" : "stop"];
