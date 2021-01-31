import { Gauge } from "./gauge";

export interface Room {
    host_ip: string,
    host_username: string,
    room_name: string,
    created_at: string,
    gauges: Gauge[]
    students: string[]
}