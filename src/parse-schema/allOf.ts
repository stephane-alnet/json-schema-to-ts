import { M } from "ts-algebra";
import { L } from "ts-toolbelt";

import { JSONSchema7 } from "definitions";

import { HasKeyIn } from "../utils";
import { MergeSubSchema } from "./utils";
import { ParseSchema } from ".";

export type ParseAllOfSchema<S extends JSONSchema7> = S extends {
  allOf: JSONSchema7[];
}
  ? RecurseOnAllOfSchema<
      S["allOf"],
      S,
      HasKeyIn<S, "enum" | "const" | "type" | "anyOf" | "oneOf"> extends true
        ? ParseSchema<Omit<S, "allOf">>
        : M.Any
    >
  : M.Error<"">;

type RecurseOnAllOfSchema<S extends JSONSchema7[], P extends JSONSchema7, R> = {
  stop: R;
  // @ts-expect-error
  continue: RecurseOnAllOfSchema<
    L.Tail<S>,
    P,
    // @ts-expect-error
    IntersectMergedSubSchemaAndResult<L.Head<S>, P, R>
  >;
}[S extends [any, ...L.List] ? "continue" : "stop"];

type IntersectMergedSubSchemaAndResult<
  S extends JSONSchema7,
  P extends JSONSchema7,
  $R,
  R extends M.Type = $R extends M.Type ? $R : M.Error<"">,
  $M = MergeSubSchema<Omit<P, "allOf">, S>,
  M extends JSONSchema7 = $M extends JSONSchema7 ? $M : {},
  $T = ParseSchema<M>,
  T extends M.Type = $T extends M.Type ? $T : M.Error<"">
> = M.Intersect<T, R>;
