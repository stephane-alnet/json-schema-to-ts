import { DoesExtend } from "../../utils";

import { Resolve, Error, Type } from "..";
import { ArrayType } from "../array";
import { TupleType } from "../tuple";
import { ObjectType } from "../object";
import { UnionType } from "../union";
import { IsRepresentable } from "../isRepresentable";
import { Intersect } from "../intersect";

import { ClearArrayIntersections } from "./array";
import { ClearTupleIntersections } from "./tuple";
import { ClearObjectIntersections } from "./object";
import { ClearUnionIntersections } from "./union";
// import { ClearExclusionIntersections } from "./exclusion";

export type IntersectionId = "intersection";

export type Intersection<L extends Type, R extends Type> = {
  type: IntersectionId;
  left: L;
  right: R;
};

export type $Intersection<A, B> = A extends Type
  ? B extends Type
    ? Intersect<A, B>
    : Error<"Second Type argument provided to $Intersection does not extend Meta.Type">
  : Error<"First Type argument provided to $Intersection does not extend Meta.Type">;

export type IntersectionType = {
  type: IntersectionId;
  left: Type;
  right: Type;
};

export type IsIntersection<I extends Type> = DoesExtend<
  I["type"],
  IntersectionType
>;

export type Left<I extends IntersectionType> = I["left"];

export type Right<I extends IntersectionType> = I["right"];

export type ResolveIntersection<T extends IntersectionType> = Resolve<
  ClearIntersections<T>
>;

export type ClearIntersections<T extends Type> = {
  any: T;
  never: T;
  const: T;
  enum: T;
  boolean: T;
  primitive: T;
  // @ts-expect-error
  array: T extends ArrayType ? ClearArrayIntersections<T> : never;
  // @ts-expect-error
  tuple: T extends TupleType ? ClearTupleIntersections<T> : never;
  // @ts-expect-error
  object: T extends ObjectType ? ClearObjectIntersections<T> : never;
  // @ts-expect-error
  union: T extends UnionType ? ClearUnionIntersections<T> : never;
  // @ts-expect-error
  intersection: T extends IntersectionType
    ? // @ts-expect-error
      Intersect<ClearIntersections<Left<T>>, ClearIntersections<Right<T>>>
    : Error<"">;
  // exclusion: ClearExclusionIntersections<T>;
  error: T;
}[T["type"]];

export type IsIntersectionRepresentable<I extends IntersectionType> =
  IsRepresentable<ClearIntersections<I>>;
