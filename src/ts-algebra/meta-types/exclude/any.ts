import { Never, Error, Type } from "..";
import { AnyType } from "../any";
import { UnionType } from "../union";

import { ExcludeUnion } from "./union";

export type ExcludeFromAny<Source extends AnyType, Excluded extends Type> = {
  any: Never;
  never: Source;
  const: Source;
  enum: Source;
  primitive: Source;
  array: Source;
  tuple: Source;
  object: Source;
  union: Excluded extends UnionType
    ? ExcludeUnion<Source, Excluded>
    : Error<"">;
  error: Excluded;
}[Excluded["type"]];
