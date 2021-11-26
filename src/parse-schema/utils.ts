import { JSONSchema7 } from "definitions";

import { Merge } from "../utils";

export type RemoveInvalidAdditionalItems<S> = "items" extends keyof S
  ? "additionalItems" extends keyof S
    ? S
    : Merge<S, { additionalItems: true }>
  : Omit<S, "additionalItems">;

export type MergeSubSchema<P, C> = Merge<
  P,
  Merge<
    { properties: {}; additionalProperties: true; required: [] },
    RemoveInvalidAdditionalItems<C>
  >
>;

// V7

export type RemoveInvalidAdditionalItems7<S extends JSONSchema7> = S extends {
  items: JSONSchema7 | JSONSchema7[];
}
  ? "additionalItems" extends keyof S
    ? S
    : Omit<S, "additionalItems"> & { additionalItems: true }
  : Omit<S, "additionalItems">;

type EmptySchema = { properties: {}; additionalProperties: true; required: [] };

export type MergeSubSchema7<
  P extends JSONSchema7,
  S extends JSONSchema7,
  R extends JSONSchema7 = RemoveInvalidAdditionalItems7<S>,
  C extends JSONSchema7 = Omit<EmptySchema, keyof R> & R
> = Omit<P, keyof C> & C;
