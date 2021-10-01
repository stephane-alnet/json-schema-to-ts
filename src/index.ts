import { A, O } from "ts-toolbelt";

import { M } from "ts-algebra";

import { JSONSchema7 as $JSONSchema7 } from "./definitions";
import { ParseSchema } from "./parse-schema";

/**
 * Unwided JSON schema (e.g. defined with the `as const` statement)
 */
export type JSONSchema7 =
  | boolean
  | $JSONSchema7
  | O.Readonly<$JSONSchema7, A.Key, "deep">;

/**
 * Given a JSON schema defined with the `as const` statement, infers the type of valid instances
 *
 * @param S JSON schema
 */
export type FromSchema<
  S extends JSONSchema7,
  $P extends any = ParseSchema<
    S extends O.Object ? O.Writable<S, A.Key, "deep"> : S
  >,
  P extends M.Type = $P extends M.Type ? $P : M.Error<"">
> = M.Resolve<P>;
