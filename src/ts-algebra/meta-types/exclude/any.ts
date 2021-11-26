import { Never, Type } from "..";
import { AnyType } from "../any";
import { UnionType } from "../union";
import { IntersectionType } from "../intersection";

import { ExcludeUnion } from "./union";
import { ExcludeIntersection } from "./intersection";

export type ExcludeFromAny<Source extends AnyType, Excluded extends Type> = {
  any: Never;
  never: Source;
  const: Source;
  enum: Source;
  boolean: Source;
  primitive: Source;
  array: Source;
  tuple: Source;
  object: Source;
  union: Excluded extends UnionType ? ExcludeUnion<Source, Excluded> : never;
  intersection: Excluded extends IntersectionType
    ? // @ts-expect-error
      ExcludeIntersection<Source, Excluded>
    : never;
  error: Excluded;
}[Excluded["type"]];
