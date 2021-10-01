import { M } from "ts-algebra";

import { JSONSchema7 } from "definitions";

import { HasKeyIn } from "../utils";
import { MergeSubSchema } from "./utils";
import { ParseSchema } from ".";

type AllTypes = M.Union<
  | M.Primitive<null>
  | M.Primitive<boolean>
  | M.Primitive<number>
  | M.Primitive<string>
  | M.Array<M.Any>
  | M.Object<{}, never, M.Any>
>;

export type ParseNotSchema<
  S extends JSONSchema7,
  $P extends any = ParseSchema<Omit<S, "not">>,
  P extends M.Type = $P extends M.Type ? $P : M.Error<"">,
  $M extends any = MergeSubSchema<Omit<S, "not">, S["not"]>,
  M extends JSONSchema7 = $M extends JSONSchema7 ? $M : {},
  $X extends any = ParseSchema<M>,
  X extends M.Type = $X extends M.Type ? $X : M.Error<"">,
  $E extends any = M.Exclude<
    HasKeyIn<
      S,
      "enum" | "const" | "type" | "anyOf" | "oneOf" | "allOf"
    > extends true
      ? P
      : AllTypes,
    X
  >,
  E extends M.Type = $E extends M.Type ? $E : M.Error<"">
> = M.IsRepresentable<E> extends true ? E : P;
