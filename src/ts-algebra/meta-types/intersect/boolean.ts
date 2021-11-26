import { Never, Error, Type } from "..";
import { ConstType } from "../const";
import { EnumType } from "../enum";
import { BooleanType } from "../boolean";
import { UnionType } from "../union";

import { IntersectConst } from "./const";
import { IntersectEnum } from "./enum";
import { IntersectUnion } from "./union";

export type IntersectBoolean<A extends BooleanType, B extends Type> = {
  any: A;
  never: Never;
  const: B extends ConstType ? IntersectConst<B, A> : never;
  enum: B extends EnumType ? IntersectEnum<B, A> : never;
  boolean: A;
  primitive: Never;
  array: Never;
  tuple: Never;
  object: Never;
  union: B extends UnionType ? IntersectUnion<B, A> : never;
  intersection: Error<"Cannot intersect intersection">;
  error: B;
}[B["type"]];
