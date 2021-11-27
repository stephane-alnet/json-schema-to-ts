import { JSONSchema7 } from "definitions";
import { M } from "ts-algebra";

import { ParseSchema, ParseV7Schema } from "../parse-schema";
import { Intersection, Union, Exclusion } from "../meta-types";
import { HasKeyIn } from "../utils";

import { MergeSubSchema, MergeSubSchema7 } from "./utils";
import { JSONSchema7TypeName } from "json-schema";

export type ParseIfThenElseSchema<
  S,
  R = Omit<S, "if" | "then" | "else">
> = HasKeyIn<
  S,
  "enum" | "const" | "type" | "anyOf" | "oneOf" | "allOf" | "not"
> extends true
  ? Intersection<ApplyIfThenElse<S, R>, ParseSchema<R>>
  : ApplyIfThenElse<S, R>;

type ApplyIfThenElse<
  S,
  R,
  I = "if" extends keyof S ? MergeSubSchema<R, S["if"]> : never
> = Union<
  | ("then" extends keyof S
      ? Intersection<ParseSchema<I>, ParseSchema<MergeSubSchema<R, S["then"]>>>
      : ParseSchema<I>)
  | Exclusion<
      "else" extends keyof S
        ? ParseSchema<MergeSubSchema<R, S["else"]>>
        : ParseSchema<R>,
      ParseSchema<I>
    >
>;

// V7

export type ParseIfThenElseSchema7<
  S extends JSONSchema7,
  P extends JSONSchema7 = Omit<S, "if" | "then" | "else">
> = S extends { if: JSONSchema7 }
  ? P extends
      | { const: unknown }
      | { enum: unknown[] }
      | { type: JSONSchema7TypeName | JSONSchema7TypeName[] }
      | { anyOf: JSONSchema7[] }
      | { oneOf: JSONSchema7[] }
      | { allOf: JSONSchema7[] }
      | { not: JSONSchema7 }
    ? // @ts-ignore
      M.$Intersect<ApplyIfThenElse7<S["if"], S, P>, ParseV7Schema<P>>
    : // @ts-ignore
      ApplyIfThenElse7<S["if"], S, P>
  : M.Error<'[ParseIfThenElseSchema7] Unable to parse schema: "if" keyword missing or invalid'>;

type ApplyIfThenElse7<
  I extends JSONSchema7,
  S extends JSONSchema7,
  P extends JSONSchema7,
  M extends JSONSchema7 = MergeSubSchema7<P, I>
> = M.$Union<
  | (S extends { then: JSONSchema7 }
      ? M.$Intersect<
          ParseV7Schema<M>,
          ParseV7Schema<MergeSubSchema7<P, S["then"]>>
        >
      : ParseV7Schema<M>)
  | M.$Exclude<
      S extends { else: JSONSchema7 }
        ? ParseV7Schema<MergeSubSchema7<P, S["else"]>>
        : ParseV7Schema<P>,
      ParseV7Schema<M>
    >
>;
