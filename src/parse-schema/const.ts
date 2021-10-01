import { M } from "ts-algebra";

import { JSONSchema7 } from "definitions";

import { HasKeyIn } from "../utils";
import { ParseSchema } from ".";

export type ParseConstSchema<S extends JSONSchema7> = HasKeyIn<
  S,
  "type"
> extends true
  ? // @ts-expect-error
    IntersectConstAndType<S>
  : M.Const<S["const"]>;

type IntersectConstAndType<
  S extends JSONSchema7,
  $P = ParseSchema<Omit<S, "const">>,
  P extends M.Type = $P extends M.Type ? $P : M.Error<"">
> = M.Intersect<M.Const<S["const"]>, P>;
