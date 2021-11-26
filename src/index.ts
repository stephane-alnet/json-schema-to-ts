import { A, O } from "ts-toolbelt";

import { JSONSchema7 } from "./definitions";
import { Resolve } from "./meta-types";
import { ParseSchema } from "./parse-schema";

/**
 * Unwided JSON schema (e.g. defined with the `as const` statement)
 */
export type JSONSchema =
  | boolean
  | JSONSchema7
  | O.Readonly<JSONSchema7, A.Key, "deep">;

/**
 * Given a JSON schema defined with the `as const` statement, infers the type of valid instances
 *
 * @param S JSON schema
 */
export type FromSchema<S extends JSONSchema> = Resolve<
  ParseSchema<S extends object ? O.Writable<S, A.Key, "deep"> : S>
>;
