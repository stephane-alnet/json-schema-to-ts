import { Never, Error, Type } from "..";
import { Const, ConstType } from "../const";
import { Enum, EnumValues, EnumType } from "../enum";
import { UnionType } from "../union";

import { Intersect } from ".";
import { IntersectConst } from "./const";
import { IntersectUnion } from "./union";

export type IntersectEnum<A extends EnumType, B extends Type> = {
  any: A;
  never: Never;
  const: B extends ConstType ? IntersectConst<B, A> : never;
  enum: FilterUnintersecting<A, B>;
  boolean: FilterUnintersecting<A, B>;
  primitive: FilterUnintersecting<A, B>;
  array: FilterUnintersecting<A, B>;
  tuple: FilterUnintersecting<A, B>;
  object: FilterUnintersecting<A, B>;
  union: B extends UnionType ? IntersectUnion<B, A> : never;
  intersection: Error<"Cannot intersect intersection">;
  error: B;
}[B["type"]];

type FilterUnintersecting<A extends EnumType, B extends Type> = Enum<
  RecurseOnEnumValues<EnumValues<A>, B>
>;

type RecurseOnEnumValues<V extends unknown, B extends Type> = V extends infer T
  ? /**
     * @debt "TODO: Use IsRepresentable ?"
     */
    Intersect<Const<T>, B> extends Never
    ? never
    : T
  : never;
