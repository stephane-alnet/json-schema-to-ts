import { M } from "ts-algebra";
import { L } from "ts-toolbelt";

import { JSONSchema7 } from "definitions";

import { DoesExtend } from "../utils";
import { ParseSchema } from ".";

export type ParseArraySchema<S extends JSONSchema7> = "items" extends keyof S
  ? S extends { items: boolean | JSONSchema7 }
    ? // @ts-expect-error
      ParseArrayItems<S["items"]>
    : S extends { items: (boolean | JSONSchema7)[] }
    ? // @ts-expect-error
      ParseTupleItems<S, S["items"]>
    : M.Error<'Invalid value in "items" property'>
  : M.Array;

type ParseArrayItems<
  S extends boolean | JSONSchema7,
  $P = ParseSchema<S>,
  P extends M.Type = $P extends M.Type ? $P : M.Error<"">
> = M.Array<P>;

type ParseTupleItems<
  S extends JSONSchema7,
  I extends (boolean | JSONSchema7)[],
  $V = RecurseOnTupleItems<I>,
  V extends M.Type[] = $V extends M.Type[] ? $V : [M.Error<"">],
  $P = ApplyAdditionalItemsAndBoundaries<V, S>,
  P extends M.Type = $P extends M.Type ? $P : M.Error<"">
> = M.Union<P>;

type RecurseOnTupleItems<
  S extends (boolean | JSONSchema7)[],
  R extends L.List = []
> = {
  stop: R;
  continue: RecurseOnTupleItems<
    L.Tail<S>,
    L.Prepend<R, ParseSchema<L.Head<S>>>
  >;
}[S extends [any, ...L.List] ? "continue" : "stop"];

type ApplyAdditionalItemsAndBoundaries<
  T extends M.Type[],
  S extends JSONSchema7
> = ApplyAdditionalItems<
  ApplyBoundaries<
    T,
    "minItems" extends keyof S ? Exclude<S["minItems"], undefined> : 0,
    "maxItems" extends keyof S ? S["maxItems"] : undefined
  >,
  S extends { additionalItems: boolean | JSONSchema7 }
    ? S["additionalItems"]
    : true
>;

type ApplyBoundaries<
  T extends M.Type[],
  Min extends number,
  Max extends number | undefined,
  R extends M.Type = never,
  HasMin extends boolean = false,
  HasMax extends boolean = false,
  C extends M.Type[] = T
> = {
  stop: {
    result: Max extends undefined
      ? R | M.Tuple<L.Reverse<T>>
      : HasMax extends true
      ? R | M.Tuple<L.Reverse<T>>
      : Max extends T["length"]
      ? M.Tuple<L.Reverse<T>>
      : IsLongerThan<L.Tail<T>, Max> extends true
      ? never
      : R | M.Tuple<L.Reverse<T>>;
    hasEncounteredMin: DoesExtend<Min, T["length"]>;
    hasEncounteredMax: HasMax extends true
      ? true
      : Max extends T["length"]
      ? true
      : IsLongerThan<L.Tail<T>, Max>;
    completeTuple: C;
  };
  continue: ApplyBoundaries<
    L.Tail<T>,
    Min,
    Max,
    T["length"] extends Max ? M.Tuple<L.Reverse<T>> : R | M.Tuple<L.Reverse<T>>,
    HasMin extends true ? true : DoesExtend<Min, T["length"]>,
    HasMax extends true ? true : DoesExtend<Max, T["length"]>,
    C
  >;
}[Min extends T["length"]
  ? "stop"
  : T extends [any, ...L.List]
  ? "continue"
  : "stop"];

type IsLongerThan<
  T extends L.List,
  N extends number | undefined,
  R extends boolean = false
> = {
  continue: T["length"] extends N ? true : IsLongerThan<L.Tail<T>, N>;
  stop: T["length"] extends N ? true : R;
}[T extends [any, ...L.List] ? "continue" : "stop"];

type ApplyAdditionalItems<
  R extends {
    result: M.Type;
    hasEncounteredMin: boolean;
    hasEncounteredMax: boolean;
    completeTuple: M.Type[];
  },
  A extends boolean | JSONSchema7
> = R["hasEncounteredMax"] extends true
  ? R["hasEncounteredMin"] extends true
    ? R["result"]
    : M.Error<'"minItems" property is lower than "maxItems"'>
  : A extends false
  ? R["hasEncounteredMin"] extends true
    ? R["result"]
    : M.Error<'"minItems" property is higher than allowed number of items'>
  : A extends true
  ? R["hasEncounteredMin"] extends true
    ? R["result"] | M.Tuple<L.Reverse<R["completeTuple"]>, M.Any>
    : M.Tuple<L.Reverse<R["completeTuple"]>, M.Any>
  : A extends JSONSchema7
  ? R["hasEncounteredMin"] extends true
    ?
        | R["result"]
        // @ts-expect-error
        | ParseAdditionalItems<L.Reverse<R["completeTuple"]>, A>
    : ParseAdditionalItems<L.Reverse<R["completeTuple"]>, A>
  : M.Error<'Invalid value in "additionalItems" property'>;

type ParseAdditionalItems<
  V extends M.Type[],
  A extends JSONSchema7,
  $P = ParseSchema<A>,
  P extends M.Type = $P extends M.Type ? $P : M.Error<"">
> = M.Tuple<V, P>;
