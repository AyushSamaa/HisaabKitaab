import { Expense } from "./Expense";
import { Friend } from "./Friend";

export interface DebtRecords {
    id: string;
    expense: Expense;
    from: Friend;
    to: Friend;
    amount: number;
}