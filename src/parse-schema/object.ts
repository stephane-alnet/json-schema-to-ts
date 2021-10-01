import { M } from "ts-algebra";

import { JSONSchema7 } from "definitions";

import { ParseSchema } from ".";

export type ParseObjectSchema<
  S extends JSONSchema7,
  // Don't know why but not specifying "extends any" leads to a bug
  $V extends any = "properties" extends keyof S
    ? {
        [key in keyof S["properties"]]: ParseSchema<S["properties"][key]>;
      }
    : {},
  V extends Record<string, M.Type> = $V extends Record<string, M.Type>
    ? $V
    : { error: M.Error<""> },
  R extends string = GetRequired<S>,
  $O = ParseOpenProps<S>,
  O extends M.Type = $O extends M.Type ? $O : M.Error<"">
> = M.Object<V, R, O>;

type GetRequired<S extends JSONSchema7> = S extends {
  required: ReadonlyArray<string>;
}
  ? S["required"][number]
  : never;

type ParseOpenProps<S extends JSONSchema7> = S extends {
  additionalProperties: Exclude<JSONSchema7["additionalProperties"], undefined>;
}
  ? S extends {
      patternProperties: Exclude<JSONSchema7["patternProperties"], undefined>;
    }
    ? // @ts-expect-error
      AdditionalAndPatternProps<
        S["additionalProperties"],
        S["patternProperties"]
      >
    : ParseSchema<S["additionalProperties"]>
  : S extends { patternProperties: JSONSchema7["patternProperties"] }
  ? // @ts-expect-error
    PatternProps<S["patternProperties"]>
  : M.Any;

type PatternProps<
  P extends Record<string, boolean | JSONSchema7>,
  $R = {
    [key in keyof P]: ParseSchema<P[key]>;
  }[keyof P],
  R extends M.Type = $R extends M.Type ? $R : M.Error<"">
> = M.Union<R>;

type AdditionalAndPatternProps<
  A extends boolean | JSONSchema7,
  P extends Record<string, boolean | JSONSchema7>,
  $R1 = ParseSchema<A>,
  R1 extends M.Type = $R1 extends M.Type ? $R1 : M.Error<"">,
  $R2 = {
    [key in keyof P]: ParseSchema<P[key]>;
  }[keyof P],
  R2 extends M.Type = $R2 extends M.Type ? $R2 : M.Error<"">
> = M.Union<R1 | R2>;
