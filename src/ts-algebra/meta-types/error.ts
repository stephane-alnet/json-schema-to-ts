export type ErrorId = "error";

export type Error<M extends string = "Unknown error"> = {
  type: ErrorId;
  message: M;
};

export type $Error<M = "Unknown error"> = M extends string
  ? Error<M>
  : Error<"Message provided to $Error does not extend string">;

export type ErrorType = {
  type: ErrorId;
  message: string;
};

export type Message<E extends ErrorType> = E["message"];
