import { JSONSchema7TypeName } from "json-schema";
import { M } from "ts-algebra";
import { L } from "ts-toolbelt";

import { JSONSchema7 } from "definitions";

import { ParseSchema } from ".";

export type ParseMixedSchema<
  S extends JSONSchema7,
  T extends JSONSchema7TypeName[] = S extends { type: JSONSchema7TypeName[] }
    ? S["type"]
    : [],
  $P extends any = RecurseOnMixedSchema<T, S>,
  P extends M.Type = $P extends M.Type ? $P : M.Error<"">
> = M.Union<P>;

type RecurseOnMixedSchema<
  T extends JSONSchema7TypeName[],
  S extends JSONSchema7,
  R extends any = never
> = {
  stop: R;
  continue: RecurseOnMixedSchema<
    L.Tail<T>,
    S,
    R | ParseUniqueType<L.Head<T>, S>
  >;
}[T extends [any, ...L.List] ? "continue" : "stop"];

type ParseUniqueType<
  T extends JSONSchema7TypeName,
  S extends JSONSchema7,
  $M extends any = Omit<S, "type"> & { type: T },
  M extends JSONSchema7 = $M extends JSONSchema7 ? $M : {}
> = ParseSchema<M>;
