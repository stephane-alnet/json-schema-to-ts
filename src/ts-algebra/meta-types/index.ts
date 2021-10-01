import { Any, AnyType } from "./any";
import { Never, NeverType } from "./never";
import { Const, ConstType } from "./const";
import { Enum, EnumType } from "./enum";
import { Primitive, $Primitive, PrimitiveType } from "./primitive";
import { $Array as Array, $$Array as $Array, ArrayType } from "./array";
import { Tuple, $Tuple, TupleType } from "./tuple";
import { Object, $Object, ObjectType } from "./object";
import { Union, $Union, UnionType } from "./union";
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
  | PrimitiveType
  | ArrayType
  | TupleType
  | ObjectType
  | UnionType
  | ErrorType;

export {
  // Meta-Types
  Any,
  Never,
  Const,
  Enum,
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
  Error,
  $Error,
  // Definitions
  AnyType,
  NeverType,
  ConstType,
  EnumType,
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
