import { Likelihood } from "../enums/likelihood";

export interface Reaction {
    [key: string]: Likelihood
}