import { Any, AnyType } from "./any";
import { Never, NeverType } from "./never";
import { Const, ConstType } from "./const";
import { Enum, EnumType } from "./enum";
import { Boolean, BooleanType } from "./boolean";
import { Primitive, $Primitive, PrimitiveType } from "./primitive";
import { $Array as Array, $$Array as $Array, ArrayType } from "./array";
import { Tuple, $Tuple, TupleType } from "./tuple";
import { Object, $Object, ObjectType } from "./object";
import { Union, $Union, UnionType } from "./union";
import { Intersection, $Intersection, IntersectionType } from "./intersection";
import { Error, $Error, ErrorType } from "./error";
import { Intersect, $Intersect } from "./intersect";
import { $Exclude as Exclude, $$Exclude as $Exclude } from "./exclude";
import { Resolve, $Resolve } from "./resolve";
import { IsRepresentable, $IsRepresentable } from "./isRepresentable";

type Type =
  | AnyType
  | NeverType
  | ConstType
  | EnumType
  | BooleanType
  | PrimitiveType
  | ArrayType
  | TupleType
  | ObjectType
  | UnionType
  | IntersectionType
  | ErrorType;

export {
  // Meta-Types
  Any,
  Never,
  Const,
  Enum,
  Boolean,
  Primitive,
  $Primitive,
  Array,
  $Array,
  Tuple,
  $Tuple,
  Object,
  $Object,
  Union,
  $Union,
  Intersection,
  $Intersection,
  Error,
  $Error,
  // Definitions
  AnyType,
  NeverType,
  ConstType,
  EnumType,
  BooleanType,
  PrimitiveType,
  ArrayType,
  TupleType,
  ObjectType,
  UnionType,
  ErrorType,
  Type,
  // Methods
  Resolve,
  $Resolve,
  Intersect,
  $Intersect,
  Exclude,
  $Exclude,
  IsRepresentable,
  $IsRepresentable,
};
