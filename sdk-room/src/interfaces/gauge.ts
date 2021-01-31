import { StudentGauge } from "./studentGauge";
import { SummedReaction } from "./summedReaction";

export interface Gauge {
    timestamp: string,
    summed_reaction: {[key:string]: SummedReaction};
    students: StudentGauge[];
}