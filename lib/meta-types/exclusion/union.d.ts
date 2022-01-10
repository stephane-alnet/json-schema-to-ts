import { A, U } from "ts-toolbelt";
import { Union, Values } from "../union";
import { Intersect } from "../intersection";
import { Exclude } from ".";
export declare type DistributeUnion<U, E> = Union<RecurseOnUnion<Values<U>, E>>;
declare type RecurseOnUnion<V, E> = V extends infer T ? Exclude<T, E> : never;
export declare type ExcludeUnion<V, U> = A.Equals<Values<U>, never> extends 1 ? V : ExcludeUnionValue<V, U.Last<Values<U>>, U>;
declare type ExcludeUnionValue<V, L, U> = Intersect<Exclude<V, L>, Exclude<V, Union<U.Exclude<Values<U>, L>>>>;
export {};
