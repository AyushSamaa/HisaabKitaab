import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Person {
  id: number;
  name: string;
  paid: number;
  owes: number;
}

interface Expense {
  id: number;
  description: string;
  amount: number;
  paidBy: number;
  shareType: 'equal' | 'unequal' | 'percentage';
  shares: { personId: number; amount: number; percentage?: number }[];
  isExpanded: boolean;
}

@Component({
  selector: 'app-quick-hisabkitab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-hisabkitab.component.html',
  styleUrls: ['./quick-hisabkitab.component.scss']
})
export class QuickHisabKitabComponent {
  people: Person[] = [];
  expenses: Expense[] = [];
  newPersonName = '';
  newExpenseDescription = '';
  newExpenseAmount = 0;
  selectedPayer = 0;
  selectedShareType: 'equal' | 'unequal' | 'percentage' = 'equal';
  showResults = false;

  // For unequal sharing
  unequalShares: { personId: number; amount: number }[] = [];
  
  // For percentage sharing
  percentageShares: { personId: number; percentage: number }[] = [];

  constructor(private router: Router) {
    // Add default people
    this.addPerson('You');
    this.addPerson('Friend 1');
    this.addPerson('Friend 2');
  }

  addPerson(name: string) {
    if (name.trim()) {
      const person: Person = {
        id: Date.now(),
        name: name.trim(),
        paid: 0,
        owes: 0
      };
      this.people.push(person);
      this.newPersonName = '';
      this.updateShares();
    }
  }

  removePerson(id: number) {
    if (this.people.length > 1) {
      this.people = this.people.filter(p => p.id !== id);
      this.expenses = this.expenses.filter(e => e.paidBy !== id);
      this.updateShares();
      this.calculateSettlements();
    }
  }

  updateShares() {
    // Update unequal shares
    this.unequalShares = this.people.map(person => ({
      personId: person.id,
      amount: 0
    }));

    // Update percentage shares
    this.percentageShares = this.people.map(person => ({
      personId: person.id,
      percentage: 100 / this.people.length
    }));
  }

  addExpense() {
    if (this.newExpenseDescription.trim() && this.newExpenseAmount > 0 && this.selectedPayer > 0) {
      // Validate shares based on type
      if (!this.validateShares()) {
        return;
      }

      const shares = this.getSharesForExpense();
      
      const expense: Expense = {
        id: Date.now(),
        description: this.newExpenseDescription.trim(),
        amount: this.newExpenseAmount,
        paidBy: this.selectedPayer,
        shareType: this.selectedShareType,
        shares: shares,
        isExpanded: false
      };
      
      this.expenses.push(expense);
      
      // Update person's paid amount
      const payer = this.people.find(p => p.id === this.selectedPayer);
      if (payer) {
        payer.paid += this.newExpenseAmount;
      }
      
      this.newExpenseDescription = '';
      this.newExpenseAmount = 0;
      this.selectedPayer = 0;
      this.calculateSettlements();
    }
  }

  validateShares(): boolean {
    if (this.selectedShareType === 'equal') {
      return true; // Equal is always valid
    }
    
    if (this.selectedShareType === 'unequal') {
      const totalShared = this.unequalShares.reduce((sum, share) => sum + share.amount, 0);
      return Math.abs(totalShared - this.newExpenseAmount) < 0.01;
    }
    
    if (this.selectedShareType === 'percentage') {
      const totalPercentage = this.percentageShares.reduce((sum, share) => sum + share.percentage, 0);
      return Math.abs(totalPercentage - 100) < 0.01;
    }
    
    return false;
  }

  getSharesForExpense(): { personId: number; amount: number; percentage?: number }[] {
    if (this.selectedShareType === 'equal') {
      const perPersonAmount = this.newExpenseAmount / this.people.length;
      return this.people.map(person => ({
        personId: person.id,
        amount: perPersonAmount
      }));
    }
    
    if (this.selectedShareType === 'unequal') {
      return this.unequalShares.filter(share => share.amount > 0);
    }
    
    if (this.selectedShareType === 'percentage') {
      return this.percentageShares.map(share => ({
        personId: share.personId,
        amount: (this.newExpenseAmount * share.percentage) / 100,
        percentage: share.percentage
      }));
    }
    
    return [];
  }

  removeExpense(id: number) {
    const expense = this.expenses.find(e => e.id === id);
    if (expense) {
      // Update person's paid amount
      const payer = this.people.find(p => p.id === expense.paidBy);
      if (payer) {
        payer.paid -= expense.amount;
      }
      
      this.expenses = this.expenses.filter(e => e.id !== id);
      this.calculateSettlements();
    }
  }

  toggleExpenseExpansion(expense: Expense) {
    expense.isExpanded = !expense.isExpanded;
  }

  calculateSettlements() {
    if (this.people.length === 0) return;

    // Reset all owes
    this.people.forEach(person => {
      person.owes = 0;
    });

    // Calculate what each person owes based on expense shares
    this.expenses.forEach(expense => {
      expense.shares.forEach(share => {
        const person = this.people.find(p => p.id === share.personId);
        if (person) {
          person.owes += share.amount;
        }
      });
    });

    // Subtract what each person has already paid
    this.people.forEach(person => {
      person.owes -= person.paid;
    });

    this.showResults = this.expenses.length > 0;
  }

  getTotalExpenses(): number {
    return this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  getPersonById(id: number): Person | undefined {
    return this.people.find(p => p.id === id);
  }

  getAbsoluteValue(value: number): number {
    return Math.abs(value);
  }

  getSettlements(): { from: Person; to: Person; amount: number }[] {
    const settlements: { from: Person; to: Person; amount: number }[] = [];
    const debtors = this.people.filter(p => p.owes < 0).sort((a, b) => a.owes - b.owes);
    const creditors = this.people.filter(p => p.owes > 0).sort((a, b) => b.owes - a.owes);

    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const debtor = debtors[debtorIndex];
      const creditor = creditors[creditorIndex];
      
      const amount = Math.min(Math.abs(debtor.owes), creditor.owes);
      
      if (amount > 0.01) {
        settlements.push({
          from: debtor,
          to: creditor,
          amount: amount
        });
        
        debtor.owes += amount;
        creditor.owes -= amount;
        
        if (Math.abs(debtor.owes) < 0.01) debtorIndex++;
        if (Math.abs(creditor.owes) < 0.01) creditorIndex++;
      } else {
        if (Math.abs(debtor.owes) < 0.01) debtorIndex++;
        if (Math.abs(creditor.owes) < 0.01) creditorIndex++;
      }
    }

    return settlements;
  }

  goBack() {
    this.router.navigate(['/login']);
  }

  resetAll() {
    this.people = [];
    this.expenses = [];
    this.showResults = false;
    this.addPerson('You');
    this.addPerson('Friend 1');
    this.addPerson('Friend 2');
  }

  onShareTypeChange() {
    this.updateShares();
  }

  updateUnequalShare(personId: number, amount: number) {
    const share = this.unequalShares.find(s => s.personId === personId);
    if (share) {
      share.amount = amount;
    }
  }

  updatePercentageShare(personId: number, percentage: number) {
    const share = this.percentageShares.find(s => s.personId === personId);
    if (share) {
      share.percentage = percentage;
    }
  }

  getUnequalTotal(): number {
    return this.unequalShares.reduce((sum, share) => sum + share.amount, 0);
  }

  getPercentageTotal(): number {
    return this.percentageShares.reduce((sum, share) => sum + share.percentage, 0);
  }
}
