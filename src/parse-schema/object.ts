import { M } from "ts-algebra";
import { JSONSchema7 } from "definitions";
import { A } from "ts-toolbelt";

import { Object, Any, Never, Union, Error } from "../meta-types";
import { IsObject } from "../utils";

import { ParseSchema, ParseV7Schema } from ".";

export type ParseObjectSchema<S> = "properties" extends keyof S
  ? Object<
      {
        [key in keyof S["properties"]]: ParseSchema<S["properties"][key]>;
      },
      GetRequired<S>,
      "additionalProperties" extends keyof S
        ? S["additionalProperties"] extends false
          ? false
          : true
        : true,
      GetOpenProps<S>
    >
  : Object<{}, GetRequired<S>, true, GetOpenProps<S>>;

type GetRequired<S> = S extends { required: ReadonlyArray<string> }
  ? S["required"][number]
  : never;

type GetOpenProps<S> = "additionalProperties" extends keyof S
  ? "patternProperties" extends keyof S
    ? AdditionalAndPatternProps<
        S["additionalProperties"],
        S["patternProperties"]
      >
    : AdditionalProps<S["additionalProperties"]>
  : "patternProperties" extends keyof S
  ? PatternProps<S["patternProperties"]>
  : Any;

type AdditionalProps<A> = A extends false
  ? Never
  : A extends true
  ? Any
  : IsObject<A> extends true
  ? ParseSchema<A>
  : Error<'Invalid value in "additionalProperties" property'>;

type PatternProps<P> = {
  type: "union";
  values: {
    [key in keyof P]: ParseSchema<P[key]>;
  }[keyof P];
};

type AdditionalAndPatternProps<A, P> = A extends boolean
  ? Union<
      {
        [key in keyof P]: ParseSchema<P[key]>;
      }[keyof P]
    >
  : IsObject<A> extends true
  ? Union<
      | ParseSchema<A>
      | {
          [key in keyof P]: ParseSchema<P[key]>;
        }[keyof P]
    >
  : never;

// V7

export type ParseObjectSchema7<S extends JSONSchema7> = S extends {
  properties: Record<A.Key, JSONSchema7>;
}
  ? M.$Object<
      {
        [key in keyof S["properties"]]: ParseV7Schema<S["properties"][key]>;
      },
      GetRequired7<S>,
      GetOpenProps7<S>
    >
  : M.$Object<{}, GetRequired7<S>, GetOpenProps7<S>>;

type GetRequired7<S> = S extends { required: A.Key[] }
  ? S["required"][number]
  : never;

type GetOpenProps7<S> = S extends {
  additionalProperties: boolean | JSONSchema7;
}
  ? S extends { patternProperties: Record<string, JSONSchema7> }
    ? AdditionalAndPatternProps7<
        S["additionalProperties"],
        S["patternProperties"]
      >
    : AdditionalProps7<S["additionalProperties"]>
  : S extends { patternProperties: Record<string, JSONSchema7> }
  ? PatternProps7<S["patternProperties"]>
  : M.Any;

type AdditionalProps7<A extends boolean | JSONSchema7> = A extends false
  ? M.Never
  : A extends true
  ? M.Any
  : A extends JSONSchema7
  ? ParseV7Schema<A>
  : M.Error<'[AdditionalProps7] Unable to parse schema: "additionalProperties" keyword missing or invalid'>;

type PatternProps7<P extends Record<string, JSONSchema7>> = M.$Union<
  {
    [key in keyof P]: ParseV7Schema<P[key]>;
  }[keyof P]
>;

type AdditionalAndPatternProps7<
  A extends boolean | JSONSchema7,
  P extends Record<string, JSONSchema7>
> = A extends boolean
  ? M.$Union<
      {
        [key in keyof P]: ParseV7Schema<P[key]>;
      }[keyof P]
    >
  : A extends JSONSchema7
  ? M.$Union<
      | ParseV7Schema<A>
      | {
          [key in keyof P]: ParseV7Schema<P[key]>;
        }[keyof P]
    >
  : M.Error<'[AdditionalProps7] Unable to parse schema: "additionalProperties" keyword missing or invalid'>;
