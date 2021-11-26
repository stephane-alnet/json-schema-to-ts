import { A, O } from "ts-toolbelt";
import { M } from "ts-algebra";

import { JSONSchema7 as $JSONSchema7 } from "./definitions";
import { Resolve } from "./meta-types";
import { ParseSchema, ParseV7Schema } from "./parse-schema";

/**
 * Unwided JSON schema (e.g. defined with the `as const` statement)
 */
export type JSONSchema7 =
  | $JSONSchema7
  | O.Readonly<$JSONSchema7, A.Key, "deep">;

/**
 * Given a JSON schema defined with the `as const` statement, infers the type of valid instances
 *
 * @param S JSON schema
 */
export type FromSchema<S extends JSONSchema7> = Resolve<
  ParseSchema<S extends object ? O.Writable<S, A.Key, "deep"> : S>
>;

/**
 * Given a v7 JSON schema defined with the `as const` statement, infers the type of valid instances
 *
 * @param S JSON schema
 */
export type FromV7Schema<S extends JSONSchema7> = M.$Resolve<
  ParseV7Schema<S extends object ? O.Writable<S, A.Key, "deep"> : S>
>;
