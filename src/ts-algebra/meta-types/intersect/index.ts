import { Never, Error, Type } from "..";
import { ConstType } from "../const";
import { EnumType } from "../enum";
import { BooleanType } from "../boolean";
import { PrimitiveType } from "../primitive";
import { ArrayType } from "../array";
import { TupleType } from "../tuple";
import { ObjectType } from "../object";
import { UnionType } from "../union";
import { ErrorId } from "../error";

import { IntersectConst } from "./const";
import { IntersectEnum } from "./enum";
import { IntersectBoolean } from "./boolean";
import { IntersectPrimitive } from "./primitive";
import { IntersectArray } from "./array";
import { IntersectTuple } from "./tuple";
import { IntersectObject } from "./object";
import { IntersectUnion } from "./union";

export type Intersect<A extends Type, B extends Type> = {
  any: B;
  never: B["type"] extends ErrorId ? B : Never;
  const: A extends ConstType ? IntersectConst<A, B> : Error<"">;
  enum: A extends EnumType ? IntersectEnum<A, B> : Error<"">;
  boolean: A extends BooleanType ? IntersectBoolean<A, B> : Error<"">;
  primitive: A extends PrimitiveType ? IntersectPrimitive<A, B> : Error<"">;
  array: A extends ArrayType ? IntersectArray<A, B> : Error<"">;
  tuple: A extends TupleType ? IntersectTuple<A, B> : Error<"">;
  object: A extends ObjectType ? IntersectObject<A, B> : Error<"">;
  union: A extends UnionType ? IntersectUnion<A, B> : Error<"">;
  intersection: Error<"Cannot intersect intersection">;
  error: A;
}[A["type"]];

export type $Intersect<A, B> = A extends Type
  ? B extends Type
    ? Intersect<A, B>
    : Error<"Second Type argument provided to $Intersect does not extend Meta.Type">
  : Error<"First Type argument provided to $Intersect does not extend Meta.Type">;
