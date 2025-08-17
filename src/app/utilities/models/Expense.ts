import { Friend } from "./Friend";
import { ShareType } from "./ShareType";
import { Share } from "./Share";

export interface Expense {
    id: string;
    name: string;
    amount: number;
    date: Date;
    payer: Friend;
    involvedFriends: Share[];
    shareType: ShareType;
}