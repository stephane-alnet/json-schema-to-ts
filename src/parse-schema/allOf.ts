import { JSONSchema7TypeName } from "json-schema";
import { L } from "ts-toolbelt";
import { M } from "ts-algebra";

import { JSONSchema7 } from "definitions";

import { Any, Intersection } from "../meta-types";
import { Get, HasKeyIn } from "../utils";

import { ParseSchema, ParseV7Schema } from ".";
import { MergeSubSchema, MergeSubSchema7 } from "./utils";

export type ParseAllOfSchema<S> = RecurseOnAllOfSchema<
  Get<S, "allOf">,
  S,
  HasKeyIn<S, "enum" | "const" | "type" | "anyOf" | "oneOf"> extends true
    ? ParseSchema<Omit<S, "allOf">>
    : Any
>;

type RecurseOnAllOfSchema<V, S, R> = {
  stop: R;
  continue: V extends L.List
    ? RecurseOnAllOfSchema<
        L.Tail<V>,
        S,
        Intersection<
          ParseSchema<MergeSubSchema<Omit<S, "allOf">, L.Head<V>>>,
          R
        >
      >
    : never;
}[V extends [any, ...L.List] ? "continue" : "stop"];

// V7

export type ParseAllOfSchema7<S extends JSONSchema7> = S extends {
  allOf: JSONSchema7[];
}
  ? RecurseOnAllOfSchema7<
      S["allOf"],
      S,
      S extends
        | { const: unknown }
        | { enum: unknown[] }
        | { type: JSONSchema7TypeName | JSONSchema7TypeName[] }
        | { anyOf: JSONSchema7[] }
        | { oneOf: JSONSchema7[] }
        ? ParseV7Schema<Omit<S, "allOf">>
        : M.Any
    >
  : M.Error<'[ParseAllOfSchema7] Unable to parse schema: "allOf" keyword missing or invalid'>;

type RecurseOnAllOfSchema7<
  V extends JSONSchema7[],
  S extends JSONSchema7,
  R extends unknown
> = {
  stop: R;
  continue: RecurseOnAllOfSchema7<
    L.Tail<V>,
    S,
    M.$Intersect<ParseV7Schema<MergeSubSchema7<Omit<S, "allOf">, L.Head<V>>>, R>
  >;
}[V extends [JSONSchema7, ...JSONSchema7[]] ? "continue" : "stop"];
