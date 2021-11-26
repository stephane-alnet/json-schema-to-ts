import { Error, Never, Type } from "..";
import { AnyType } from "../any";
import { ConstType } from "../const";
import { EnumType } from "../enum";
import { BooleanType } from "../boolean";
import { PrimitiveType } from "../primitive";
import { ArrayType } from "../array";
import { TupleType } from "../tuple";
import { ObjectType } from "../object";
import { UnionType } from "../union";
import { ClearIntersections } from "../intersection";

import { ExcludeFromAny } from "./any";
import { ExcludeFromConst } from "./const";
import { ExcludeFromEnum } from "./enum";
import { ExcludeFromBoolean } from "./boolean";
import { ExcludeFromPrimitive } from "./primitive";
import { ExcludeFromArray } from "./array";
import { ExcludeFromTuple } from "./tuple";
import { ExcludeFromObject } from "./object";
import { DistributeUnion } from "./union";

// Prefixed with $ to not confuse with native TS Exclude
export type $Exclude<A extends Type, B extends Type> = {
  any: A extends AnyType ? ExcludeFromAny<A, B> : Error<"">;
  never: Never;
  const: A extends ConstType ? ExcludeFromConst<A, B> : Error<"">;
  enum: A extends EnumType ? ExcludeFromEnum<A, B> : Error<"">;
  boolean: A extends BooleanType ? ExcludeFromBoolean<A, B> : Error<"">;
  primitive: A extends PrimitiveType ? ExcludeFromPrimitive<A, B> : Error<"">;
  array: A extends ArrayType ? ExcludeFromArray<A, B> : Error<"">;
  tuple: A extends TupleType ? ExcludeFromTuple<A, B> : Error<"">;
  object: A extends ObjectType ? ExcludeFromObject<A, B> : Error<"">;
  union: A extends UnionType ? DistributeUnion<A, B> : Error<"">;
  // @ts-expect-error
  intersection: $Exclude<ClearIntersections<A>, B>;
  error: A;
}[A["type"]];

export type $$Exclude<A, B> = A extends Type
  ? B extends Type
    ? $Exclude<A, B>
    : Error<"Second Type argument provided to $Exclude does not extend Meta.Type">
  : Error<"First Type argument provided to $Exclude does not extend Meta.Type">;
