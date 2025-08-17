import { Friend } from "./Friend";

export interface Share {
    friend: Friend;
    amount: number;
    percentage?: number;
}