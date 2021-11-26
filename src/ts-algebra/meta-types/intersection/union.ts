import { Type } from "..";
import { Union, UnionValues, UnionType } from "../union";
import { Error } from "../error";

import { ClearIntersections } from ".";

export type ClearUnionIntersections<
  A extends UnionType,
  $C = ClearUnionValuesIntersections<UnionValues<A>>,
  C extends Type = $C extends Type
    ? $C
    : Error<"[ClearUnionIntersections] ClearUnionValuesIntersections result does not extends MetaType">
> = Union<C>;

type ClearUnionValuesIntersections<V extends Type> = V extends infer T
  ? T extends Type
    ? ClearIntersections<T>
    : never
  : never;
