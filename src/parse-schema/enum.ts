import { M } from "ts-algebra";

import { JSONSchema7 } from "definitions";

import { HasKeyIn } from "../utils";
import { ParseSchema } from ".";

export type ParseEnumSchema<S extends JSONSchema7> = HasKeyIn<
  S,
  "const" | "type"
> extends true
  ? // @ts-expect-error
    IntersectEnumAndRestSchema<S>
  : ParseEnum<S>;

type IntersectEnumAndRestSchema<
  S extends JSONSchema7,
  $P = ParseSchema<Omit<S, "enum">>,
  P extends M.Type = $P extends M.Type ? $P : M.Error<"">
> = M.Intersect<ParseEnum<S>, P>;

type ParseEnum<S extends JSONSchema7> = S extends { enum: unknown[] }
  ? M.Enum<S["enum"][number]>
  : M.Error<"">;
