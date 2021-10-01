import { And, Not } from "../../utils";

import { Type } from "..";
import { IsRepresentable } from "../isRepresentable";

import { $Exclude } from ".";

export type CrossedValue = {
  sourceValue: Type;
  isPossibleInSource: boolean;
  isRequiredInSource: boolean;
  isPossibleInExcluded: boolean;
  isRequiredInExcluded: boolean;
  exclusionValue: Type;
  isExclusionValueRepresentable: boolean;
};

export type CrossValue<
  V1 extends Type,
  P1 extends boolean,
  R1 extends boolean,
  V2 extends Type,
  P2 extends boolean,
  R2 extends boolean,
  X extends any = $Exclude<V1, V2>
> = {
  sourceValue: V1;
  isPossibleInSource: P1;
  isRequiredInSource: R1;
  isPossibleInExcluded: P2;
  isRequiredInExcluded: R2;
  exclusionValue: X;
  isExclusionValueRepresentable: X extends Type ? IsRepresentable<X> : false;
};

export type SourceValue<C extends CrossedValue> = C["sourceValue"];

type IsPossibleInSource<C extends CrossedValue> = C["isPossibleInSource"];

type IsRequiredInSource<C extends CrossedValue> = C["isRequiredInSource"];

type IsPossibleInExcluded<C extends CrossedValue> = C["isPossibleInExcluded"];

type IsRequiredInExcluded<C extends CrossedValue> = C["isRequiredInExcluded"];

export type ExclusionValue<C extends CrossedValue> = C["exclusionValue"];

export type IsExclusionValueRepresentable<C extends CrossedValue> =
  C["isExclusionValueRepresentable"];

export type IsOutsideOfSourceScope<C extends CrossedValue> = And<
  IsRequiredInExcluded<C>,
  Not<IsPossibleInSource<C>>
>;

export type IsOutsideOfExcludedScope<C extends CrossedValue> = And<
  IsRequiredInSource<C>,
  Not<IsPossibleInExcluded<C>>
>;

export type Propagate<C extends CrossedValue> =
  IsExclusionValueRepresentable<C> extends true
    ? ExclusionValue<C>
    : SourceValue<C>;

export type IsOmittable<C extends CrossedValue> = And<
  Not<IsRequiredInSource<C>>,
  IsRequiredInExcluded<C>
>;
