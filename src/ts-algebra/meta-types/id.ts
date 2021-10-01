import { AnyId } from "./any";
import { NeverId } from "./never";
import { ConstId } from "./const";
import { EnumId } from "./enum";
import { PrimitiveId } from "./primitive";
import { ArrayId } from "./array";
import { TupleId } from "./tuple";
import { ObjectId } from "./object";
import { UnionId } from "./union";
import { ErrorId } from "./error";

export type TypeId =
  | AnyId
  | NeverId
  | ConstId
  | EnumId
  | PrimitiveId
  | ArrayId
  | TupleId
  | ObjectId
  | UnionId
  | ErrorId;
