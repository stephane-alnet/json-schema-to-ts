import { A, B, L } from "ts-toolbelt";
import { Get, And, Not } from "../../utils";
import { MetaType, Never, Error } from "..";
import { Const, Value as ConstValue } from "../const";
import { Values as ArrayValues } from "../array";
import { Tuple, Values, IsOpen, OpenProps } from "../tuple";
import { IsRepresentable } from "../utils";
import { Exclude } from ".";
import { ExcludeEnum } from "./enum";
import { ExcludeUnion } from "./union";
import { ExcludeIntersection } from "./intersection";
import { ExcludeExclusion } from "./exclusion";
import { CrossValue, SourceValue, IsExclusionValueRepresentable, IsOutsideOfSourceScope, IsOutsideOfExcludedScope, Propagate, IsOmittable } from "./utils";
export declare type ExcludeFromTuple<S, E> = {
    any: Never;
    never: S;
    const: ExcludeConst<S, E>;
    enum: ExcludeEnum<S, E>;
    primitive: S;
    brandedPrimitive: S;
    array: ExcludeArray<S, E>;
    tuple: ExcludeTuples<S, E>;
    object: S;
    union: ExcludeUnion<S, E>;
    intersection: ExcludeIntersection<S, E>;
    exclusion: ExcludeExclusion<S, E>;
    error: E;
    errorMissingType: Error<"Missing type property in Exclusion excluded value">;
}[Get<E, "type"> extends MetaType ? Get<E, "type"> : "errorMissingType"];
declare type ExcludeArray<S, E> = ExcludeTuples<S, Tuple<[], true, ArrayValues<E>>>;
declare type ExcludeTuples<S, E, C extends L.List = CrossTupleValues<A.Cast<Values<S>, L.List>, A.Cast<Values<E>, L.List>, IsOpen<S>, IsOpen<E>, OpenProps<S>, OpenProps<E>>, R extends L.List = RepresentableItems<C>, P = Exclude<OpenProps<S>, OpenProps<E>>, I = IsRepresentable<P>> = DoesTupleSizesMatch<S, E, C> extends true ? {
    moreThanTwo: S;
    onlyOne: Tuple<PropagateExclusion<C>, I extends true ? IsOpen<S> : false, P>;
    none: OmitOmittableItems<S, C>;
}[And<IsOpen<S>, I> extends true ? "moreThanTwo" : GetTupleLength<R>] : S;
declare type CrossTupleValues<V1 extends L.List, V2 extends L.List, O1, O2, P1, P2, R extends L.List = []> = {
    stop: L.Reverse<R>;
    continue1: CrossTupleValues<L.Tail<V1>, [], O1, O2, P1, P2, L.Prepend<R, CrossValue<L.Head<V1>, true, true, P2, O2, false>>>;
    continue2: CrossTupleValues<[], L.Tail<V2>, O1, O2, P1, P2, L.Prepend<R, CrossValue<P1, O1, false, L.Head<V2>, true, true>>>;
    continueBoth: CrossTupleValues<L.Tail<V1>, L.Tail<V2>, O1, O2, P1, P2, L.Prepend<R, CrossValue<L.Head<V1>, true, true, L.Head<V2>, true, true>>>;
}[V1 extends [any, ...L.List] ? V2 extends [any, ...L.List] ? "continueBoth" : "continue1" : V2 extends [any, ...L.List] ? "continue2" : "stop"];
declare type GetTupleLength<T extends L.List, R extends L.List = L.Tail<T>> = A.Equals<T, []> extends B.True ? "none" : A.Equals<R, []> extends B.True ? "onlyOne" : "moreThanTwo";
declare type DoesTupleSizesMatch<S, E, C extends L.List> = And<IsOpen<S>, Not<IsOpen<E>>> extends true ? false : And<IsExcludedSmallEnough<C>, IsExcludedBigEnough<C>>;
declare type IsExcludedSmallEnough<C extends L.List> = {
    stop: true;
    continue: IsOutsideOfSourceScope<L.Head<C>> extends true ? false : IsExcludedSmallEnough<L.Tail<C>>;
}[C extends [any, ...L.List] ? "continue" : "stop"];
declare type IsExcludedBigEnough<C extends L.List> = {
    stop: true;
    continue: IsOutsideOfExcludedScope<L.Head<C>> extends true ? false : IsExcludedBigEnough<L.Tail<C>>;
}[C extends [any, ...L.List] ? "continue" : "stop"];
declare type RepresentableItems<C extends L.List, R extends L.List = []> = {
    stop: R;
    continue: IsExclusionValueRepresentable<L.Head<C>> extends true ? RepresentableItems<L.Tail<C>, L.Prepend<R, L.Head<C>>> : RepresentableItems<L.Tail<C>, R>;
}[C extends [any, ...L.List] ? "continue" : "stop"];
declare type PropagateExclusion<C extends L.List, R extends L.List = []> = {
    stop: L.Reverse<R>;
    continue: PropagateExclusion<L.Tail<C>, L.Prepend<R, Propagate<L.Head<C>>>>;
}[C extends [any, ...L.List] ? "continue" : "stop"];
declare type OmitOmittableItems<S, C extends L.List, I extends L.List = OmittableItems<C>> = {
    moreThanTwo: S;
    onlyOne: Tuple<RequiredTupleValues<C>, false, OpenProps<S>>;
    none: Never;
}[GetTupleLength<I>];
declare type OmittableItems<C extends L.List, R extends L.List = []> = {
    stop: R;
    continue: IsOmittable<L.Head<C>> extends true ? OmittableItems<L.Tail<C>, L.Prepend<R, L.Head<C>>> : OmittableItems<L.Tail<C>, R>;
}[C extends [any, ...L.List] ? "continue" : "stop"];
declare type RequiredTupleValues<C extends L.List, R extends L.List = []> = {
    stop: L.Reverse<R>;
    continue: IsOmittable<L.Head<C>> extends true ? L.Reverse<R> : RequiredTupleValues<L.Tail<C>, L.Prepend<R, SourceValue<L.Head<C>>>>;
}[C extends [any, ...L.List] ? "continue" : "stop"];
declare type ExcludeConst<S, E, V = ConstValue<E>> = V extends L.List ? Exclude<S, Tuple<ExtractConstValues<V>, false, Never>> : S;
declare type ExtractConstValues<V extends L.List, R extends L.List = []> = {
    stop: L.Reverse<R>;
    continue: ExtractConstValues<L.Tail<V>, L.Prepend<R, Const<L.Head<V>>>>;
}[V extends [any, ...L.List] ? "continue" : "stop"];
export {};
