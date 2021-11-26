import { A, L } from "ts-toolbelt";
import { M } from "ts-algebra";

import { JSONSchema7 } from "definitions";

import { Arr, Tuple, Union, Error } from "../meta-types";
import { DoesExtend, Get, IsObject } from "../utils";

import { ParseSchema, ParseV7Schema } from ".";

export type ParseArrSchema<S> = "items" extends keyof S
  ? IsObject<S["items"]> extends true
    ? Arr<ParseSchema<S["items"]>>
    : S["items"] extends L.List
    ? // 🔧 TOIMPROVE: Not cast here
      Union<FromTreeTuple<ParseTuple<A.Cast<S["items"], L.List>>, S>>
    : Error<'Invalid value in "items" property'>
  : Arr;

export type ParseTuple<S extends L.List, R extends L.List = []> = {
  stop: R;
  continue: ParseTuple<L.Tail<S>, L.Prepend<R, ParseSchema<L.Head<S>>>>;
}[S extends [any, ...L.List] ? "continue" : "stop"];

type FromTreeTuple<T extends L.List, S> = ApplyAdditionalItems<
  ApplyBoundaries<
    T,
    "minItems" extends keyof S ? S["minItems"] : 0,
    "maxItems" extends keyof S ? S["maxItems"] : undefined
  >,
  "additionalItems" extends keyof S ? S["additionalItems"] : true
>;

type ApplyBoundaries<
  T extends L.List,
  Min,
  Max,
  R = never,
  HasMin extends boolean = false,
  HasMax extends boolean = false,
  C = T
> = {
  stop: {
    result: Max extends undefined
      ? R | Tuple<L.Reverse<T>, false>
      : HasMax extends true
      ? R | Tuple<L.Reverse<T>, false>
      : Max extends T["length"]
      ? Tuple<L.Reverse<T>, false>
      : IsLongerThan<L.Tail<T>, Max> extends true
      ? never
      : R | Tuple<L.Reverse<T>, false>;
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
    T["length"] extends Max
      ? Tuple<L.Reverse<T>, false>
      : R | Tuple<L.Reverse<T>, false>,
    HasMin extends true ? true : DoesExtend<Min, T["length"]>,
    HasMax extends true ? true : DoesExtend<Max, T["length"]>,
    C
  >;
}[Min extends T["length"]
  ? "stop"
  : T extends [any, ...L.List]
  ? "continue"
  : "stop"];

type IsLongerThan<T extends L.List, N, R = false> = {
  continue: T["length"] extends N ? true : IsLongerThan<L.Tail<T>, N>;
  stop: T["length"] extends N ? true : R;
}[T extends [any, ...L.List] ? "continue" : "stop"];

type ApplyAdditionalItems<R, A> = Get<R, "hasEncounteredMax"> extends true
  ? Get<R, "hasEncounteredMin"> extends true
    ? Get<R, "result">
    : Error<'"minItems" property is lower than "maxItems"'>
  : A extends false
  ? Get<R, "hasEncounteredMin"> extends true
    ? Get<R, "result">
    : Error<'"minItems" property is higher than allowed number of items'>
  : A extends true
  ? Get<R, "hasEncounteredMin"> extends true
    ?
        | Get<R, "result">
        | Tuple<L.Reverse<A.Cast<Get<R, "completeTuple">, L.List>>>
    : // 🔧 TOIMPROVE: Not cast here
      Tuple<L.Reverse<A.Cast<Get<R, "completeTuple">, L.List>>>
  : IsObject<A> extends true
  ? Get<R, "hasEncounteredMin"> extends true
    ?
        | Get<R, "result">
        | Tuple<
            // 🔧 TOIMPROVE: Not cast here
            L.Reverse<A.Cast<Get<R, "completeTuple">, L.List>>,
            true,
            ParseSchema<A>
          >
    : Tuple<
        // 🔧 TOIMPROVE: Not cast here
        L.Reverse<A.Cast<Get<R, "completeTuple">, L.List>>,
        true,
        ParseSchema<A>
      >
  : Error<'Invalid value in "additionalItems" property'>;

// V7

export type ParseArraySchema7<S extends JSONSchema7> = S extends {
  items: JSONSchema7;
}
  ? M.$Array<ParseV7Schema<S["items"]>>
  : S extends { items: JSONSchema7[] }
  ? M.$Union<FromMetaTypeTuple7<ParseTuple7<S["items"]>, S>>
  : M.Array;

export type ParseTuple7<S extends JSONSchema7[], R extends unknown[] = []> = {
  stop: R;
  continue: ParseTuple7<L.Tail<S>, L.Prepend<R, ParseV7Schema<L.Head<S>>>>;
}[S extends [any, ...L.List] ? "continue" : "stop"];

type FromMetaTypeTuple7<
  T extends unknown[],
  S extends JSONSchema7
> = ApplyAdditionalItems7<
  ApplyBoundaries7<
    T,
    S extends { minItems: number } ? S["minItems"] : 0,
    S extends { maxItems: number } ? S["maxItems"] : undefined
  >,
  S extends { additionalItems: boolean | JSONSchema7 }
    ? S["additionalItems"]
    : true
>;

type ApplyBoundaries7<
  T extends unknown[],
  Min extends number,
  Max extends number | undefined,
  R extends unknown = never,
  HasMin extends boolean = false,
  HasMax extends boolean = false,
  C extends unknown[] = T
> = {
  stop: {
    result: Max extends undefined
      ? R | M.$Tuple<L.Reverse<T>>
      : HasMax extends true
      ? R | M.$Tuple<L.Reverse<T>>
      : Max extends T["length"]
      ? M.$Tuple<L.Reverse<T>>
      : IsLongerThan7<L.Tail<T>, Max> extends true
      ? never
      : R | M.$Tuple<L.Reverse<T>>;
    hasEncounteredMin: DoesExtend<Min, T["length"]>;
    hasEncounteredMax: HasMax extends true
      ? true
      : Max extends T["length"]
      ? true
      : IsLongerThan7<L.Tail<T>, Max>;
    completeTuple: C;
  };
  continue: ApplyBoundaries7<
    L.Tail<T>,
    Min,
    Max,
    T["length"] extends Max
      ? M.$Tuple<L.Reverse<T>>
      : R | M.$Tuple<L.Reverse<T>>,
    HasMin extends true ? true : DoesExtend<Min, T["length"]>,
    HasMax extends true ? true : DoesExtend<Max, T["length"]>,
    C
  >;
}[Min extends T["length"]
  ? "stop"
  : T extends [any, ...L.List]
  ? "continue"
  : "stop"];

type IsLongerThan7<
  T extends L.List,
  N extends number | undefined,
  R extends boolean = false
> = {
  continue: N extends undefined
    ? false
    : T["length"] extends N
    ? true
    : IsLongerThan7<L.Tail<T>, N>;
  stop: T["length"] extends N ? true : R;
}[T extends [unknown, ...unknown[]] ? "continue" : "stop"];

type ApplyAdditionalItems7<
  R extends {
    result: unknown;
    hasEncounteredMin: boolean;
    hasEncounteredMax: boolean;
    completeTuple: unknown[];
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
    ? R["result"] | M.$Tuple<L.Reverse<R["completeTuple"]>, M.Any>
    : M.$Tuple<L.Reverse<R["completeTuple"]>, M.Any>
  : A extends JSONSchema7
  ? R["hasEncounteredMin"] extends true
    ? R["result"] | M.$Tuple<L.Reverse<R["completeTuple"]>, ParseV7Schema<A>>
    : M.$Tuple<L.Reverse<R["completeTuple"]>, ParseV7Schema<A>>
  : M.Error<'Invalid value in "additionalItems" property'>;
