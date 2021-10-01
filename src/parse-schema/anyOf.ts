import { M } from "ts-algebra";
import { L } from "ts-toolbelt";

import { JSONSchema7 } from "definitions";

import { HasKeyIn } from "../utils";
import { MergeSubSchema } from "./utils";
import { ParseSchema } from ".";

export type ParseAnyOfSchema<
  S extends JSONSchema7,
  $V = S extends { anyOf: JSONSchema7[] }
    ? RecurseOnAnyOfSchema<S["anyOf"], Omit<S, "anyOf">>
    : M.Error<"">,
  V extends M.Type = $V extends M.Type ? $V : M.Error<"">
> = M.Union<V>;

type RecurseOnAnyOfSchema<
  S extends JSONSchema7[],
  P extends JSONSchema7,
  R = never
> = {
  stop: R;
  continue: RecurseOnAnyOfSchema<
    L.Tail<S>,
    P,
    | R
    | (HasKeyIn<P, "enum" | "const" | "type"> extends true
        ? // @ts-expect-error
          IntersectSubSchemaAndParsedParentSchema<L.Head<S>, P>
        : // @ts-expect-error
          ParseSubSchema<L.Head<S>, P>)
  >;
}[S extends [any, ...L.List] ? "continue" : "stop"];

type IntersectSubSchemaAndParsedParentSchema<
  S extends JSONSchema7,
  P extends JSONSchema7,
  $M = MergeSubSchema<P, S>,
  M extends JSONSchema7 = $M extends JSONSchema7 ? $M : {},
  $T1 = ParseSchema<M>,
  T1 extends M.Type = $T1 extends M.Type ? $T1 : M.Error<"">,
  $T2 = ParseSchema<P>,
  T2 extends M.Type = $T2 extends M.Type ? $T2 : M.Error<"">
> = M.Intersect<T1, T2>;

type ParseSubSchema<
  S extends JSONSchema7,
  P extends JSONSchema7,
  $M = MergeSubSchema<P, S>,
  M extends JSONSchema7 = $M extends JSONSchema7 ? $M : {},
  $T = ParseSchema<M>,
  T extends M.Type = $T extends M.Type ? $T : M.Error<"">
> = T;
