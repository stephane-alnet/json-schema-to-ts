import { Type } from "..";
import { $Array, ArrayType, ArrayValues } from "../array";
import { Error } from "../error";

import { ClearIntersections } from ".";

export type ClearArrayIntersections<
  A extends ArrayType,
  C = ClearIntersections<ArrayValues<A>>
> = C extends Type
  ? $Array<C>
  : Error<"[ClearArrayIntersections] ClearIntersections result does not extend MetaType">;
