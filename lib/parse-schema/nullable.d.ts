import { Union, Primitive } from "../meta-types";
import { ParseSchema } from ".";
export declare type ParseNullableSchema<S> = Union<Primitive<null> | ParseSchema<S>>;
