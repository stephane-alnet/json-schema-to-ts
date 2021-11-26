import { Type } from "..";
import { IntersectionType, ClearIntersections } from "../intersection";
import { Error } from "../error";
import { $Exclude } from ".";

export type ExcludeIntersection<
  S extends Type,
  X extends IntersectionType,
  $C = ClearIntersections<X>,
  C extends Type = $C extends Type
    ? $C
    : Error<"[ExcludeIntersection] ClearIntersections result does not extend MetaType">
> = $Exclude<S, C>;
