import { Error, Type } from ".";
import { IsEnumRepresentable, EnumType } from "./enum";
import { IsTupleRepresentable, TupleType } from "./tuple";
import { IsObjectRepresentable, ObjectType } from "./object";
import { IsUnionRepresentable, UnionType } from "./union";
import { IsIntersectionRepresentable, IntersectionType } from "./intersection";

export type IsRepresentable<A extends Type> = {
  any: true;
  never: false;
  const: true;
  enum: A extends EnumType ? IsEnumRepresentable<A> : false;
  boolean: true;
  primitive: true;
  array: true; // Empty array will represent any array
  tuple: A extends TupleType ? IsTupleRepresentable<A> : false;
  object: A extends ObjectType ? IsObjectRepresentable<A> : false;
  // @ts-expect-error
  union: A extends UnionType ? IsUnionRepresentable<A> : false;
  intersection: A extends IntersectionType
    ? IsIntersectionRepresentable<A>
    : false;
  error: false;
}[A["type"]];

export type $IsRepresentable<A> = A extends Type
  ? IsRepresentable<A>
  : Error<"Type provided to $IsRepresentable does not extend Meta.Type">;
