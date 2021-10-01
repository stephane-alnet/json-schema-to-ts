import { Type } from "..";
import { Never } from "../never";
import { Union, UnionValues, UnionType } from "../union";

import { Intersect } from ".";

export type IntersectUnion<A extends UnionType, B extends Type> = {
  any: A;
  never: Never;
  const: DistributeIntersection<A, B>;
  enum: DistributeIntersection<A, B>;
  primitive: DistributeIntersection<A, B>;
  array: DistributeIntersection<A, B>;
  tuple: DistributeIntersection<A, B>;
  object: DistributeIntersection<A, B>;
  union: DistributeIntersection<A, B>;
  error: B;
}[B["type"]];

export type DistributeIntersection<
  A extends UnionType,
  B extends Type,
  V extends any = RecurseOnUnion<UnionValues<A>, B>
  /**
   * @debt "Casting intersected Values union as Type has unexpected side effects"
   */
  // @ts-expect-error
> = Union<V>;

type RecurseOnUnion<V extends Type, B extends Type> = V extends infer T
  ? // @ts-expect-error: T necessarily extends Type
    Intersect<T, B>
  : never;
