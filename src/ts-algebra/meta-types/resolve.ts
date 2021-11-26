import { Type } from ".";
import { ResolveAny } from "./any";
import { ResolveNever } from "./never";
import { ResolveConst, ConstType } from "./const";
import { ResolveBoolean } from "./boolean";
import { ResolveEnum, EnumType } from "./enum";
import { ResolvePrimitive, PrimitiveType } from "./primitive";
import { ResolveArray, ArrayType } from "./array";
import { ResolveTuple, TupleType } from "./tuple";
import { ResolveObject, ObjectType } from "./object";
import { ResolveUnion, UnionType } from "./union";
import { ResolveIntersection, IntersectionType } from "./intersection";

export type Resolve<T extends Type> = {
  any: ResolveAny;
  never: ResolveNever;
  const: T extends ConstType ? ResolveConst<T> : never;
  enum: T extends EnumType ? ResolveEnum<T> : never;
  boolean: ResolveBoolean;
  primitive: T extends PrimitiveType ? ResolvePrimitive<T> : never;
  array: T extends ArrayType ? ResolveArray<T> : never;
  tuple: T extends TupleType ? ResolveTuple<T> : never;
  object: T extends ObjectType ? ResolveObject<T> : never;
  union: T extends UnionType ? ResolveUnion<T> : never;
  intersection: T extends IntersectionType ? ResolveIntersection<T> : never;
  error: never;
}[T["type"]];

export type $Resolve<T> = T extends Type ? Resolve<T> : never;
