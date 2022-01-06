import { Get } from "../../utils";

import { MetaType, Never, Error } from "..";
import { Value } from "../primitive";

import { IntersectConst } from "./const";
import { IntersectEnum } from "./enum";
import { IntersectExclusion } from "./exclusion";
import { Intersect } from ".";

export type IntersectPrimitive<A, B> = {
  any: A;
  never: Never;
  const: IntersectConst<B, A>;
  enum: IntersectEnum<B, A>;
  primitive: Value<A> extends Value<B>
    ? A
    : Value<B> extends Value<A>
    ? B
    : Never;
  brandedPrimitive: Value<A> extends Value<B>
    ? A
    : Value<B> extends Value<A>
    ? B
    : Never;
  array: Never;
  tuple: Never;
  object: Never;
  union: Intersect<B, A>;
  intersection: Error<"Cannot intersect intersection">;
  exclusion: IntersectExclusion<B, A>;
  error: B;
  errorTypeProperty: Error<"Missing type property">;
}[Get<B, "type"> extends MetaType ? Get<B, "type"> : "errorTypeProperty"];
