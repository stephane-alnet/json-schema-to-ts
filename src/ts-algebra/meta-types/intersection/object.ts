import { A } from "ts-toolbelt";

import { Type } from "..";
import { Never } from "../never";
import {
  Object,
  ObjectValues,
  OpenProps,
  Required,
  ObjectType,
  NonRepresentableKeys,
} from "../object";
import { Error } from "../error";

import { ClearIntersections } from ".";

export type ClearObjectIntersections<
  A extends ObjectType,
  $V = ClearObjectValuesIntersections<ObjectValues<A>>,
  V extends Record<A.Key, Type> = $V extends Record<A.Key, Type>
    ? $V
    : {
        error: Error<"[ClearObjectIntersections] ClearObjectValuesIntersections result does not extend Record<A.Key, MetaType>">;
      },
  N = NonRepresentableKeys<V>,
  $O = ClearIntersections<OpenProps<A>>,
  O extends Type = $O extends Type
    ? $O
    : Error<"[ClearObjectIntersections] ClearIntersections result does not extend MetaType">
> = Required<A> extends Exclude<Required<A>, N>
  ? Object<
      {
        [key in Exclude<keyof V, N>]: V[key];
      },
      Required<A>,
      O
    >
  : Never;

type ClearObjectValuesIntersections<V extends Record<A.Key, Type>> = {
  [key in keyof V]: ClearIntersections<V[key]>;
};
