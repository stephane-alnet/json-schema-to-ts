import { Prettify } from "../utils";

import { Any, Error, Type } from ".";
import { Resolve } from "./resolve";

export type ArrayId = "array";

// Prefixed with $ to not confuse with native Array type
export type $Array<V extends Type = Any> = {
  type: ArrayId;
  values: V;
};

export type $$Array<V = Any> = V extends Type
  ? $Array<V>
  : Error<"Type provided to $Array does not extend Meta.Type">;

export type ArrayType = {
  type: ArrayId;
  values: Type;
};

export type ArrayValues<A extends ArrayType> = A["values"];

export type ResolveArray<T extends ArrayType> = Prettify<
  Resolve<ArrayValues<T>>[]
>;
