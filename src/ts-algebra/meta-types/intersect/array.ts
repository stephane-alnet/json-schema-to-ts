import { Never, Error, Type } from "..";
import { ConstType } from "../const";
import { EnumType } from "../enum";
import { $Array, ArrayValues, ArrayType } from "../array";
import { TupleType } from "../tuple";
import { UnionType } from "../union";

import { Intersect } from ".";
import { IntersectConst } from "./const";
import { IntersectEnum } from "./enum";
import { IntersectTuple } from "./tuple";
import { IntersectUnion } from "./union";

export type IntersectArray<A extends ArrayType, B extends Type> = {
  any: A;
  never: Never;
  const: B extends ConstType ? IntersectConst<B, A> : never;
  enum: B extends EnumType ? IntersectEnum<B, A> : never;
  boolean: Never;
  primitive: Never;
  array: B extends ArrayType ? IntersectArrays<A, B> : never;
  tuple: B extends TupleType ? IntersectTuple<B, A> : never;
  object: Never;
  union: B extends UnionType ? IntersectUnion<B, A> : never;
  intersection: Error<"Cannot intersect intersection">;
  error: B;
}[B["type"]];

type IntersectArrays<
  A extends ArrayType,
  B extends ArrayType,
  /**
   * @debt "TODO: Define $I to cast as Type"
   */
  I = Intersect<ArrayValues<A>, ArrayValues<B>>
> = I extends Type
  ? $Array<I>
  : Error<"[IntersectArrays] Intersect result does not extend MetaType">;
