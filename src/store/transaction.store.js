import { create } from "zustand";
import { StorageUtils } from "../constants/storage.utils";

export const useTransactionStore = create((set, get) => ({
    transactions: [],
    isLoading: false,

    // LOAD TRANSACTIONS FROM STORAGE
    loadTransactions: async () => {
        set({
            isLoading: true
        });
        try {
            const transactions = await StorageUtils.loadTransactions();
            set({
                transactions,
                isLoading: false
            });
            return { success: true };
        } catch (error) {
            console.error("loadTransactions error:", error);
            set({
                isLoading: false
            });
            return {
                success: false,
                message: error.message || "Failed to load transactions"
            };
        }
    },

    // ADD NEW TRANSACTION
    addTransaction: async (transactionData) => {
        try {
            const date = transactionData.date || new Date();
            const newTransaction = {
                ...transactionData,
                id: Date.now().toString(),
                date: date,
                day: date.getDate(),
                month: date.getMonth() + 1,
                year: date.getFullYear()
            };

            const currentTransactions = get().transactions;
            const updatedTransactions = [newTransaction, ...currentTransactions];

            set({
                transactions: updatedTransactions
            });

            await StorageUtils.saveTransactions(updatedTransactions);
            return { success: true };
        } catch (error) {
            console.error("addTransaction error:", error);
            return {
                success: false,
                message: error.message || "Failed to add transaction"
            };
        }
    },

    // DELETE TRANSACTION
    deleteTransaction: async (id) => {
        try {
            const currentTransactions = get().transactions;
            const updatedTransactions = currentTransactions.filter(t => t.id !== id);

            set({
                transactions: updatedTransactions
            });

            await StorageUtils.saveTransactions(updatedTransactions);
            return { success: true };
        } catch (error) {
            console.error("deleteTransaction error:", error);
            return {
                success: false,
                message: error.message || "Failed to delete transaction"
            };
        }
    },

    // GET TOTAL INCOME
    getTotalIncome: () => {
        const transactions = get().transactions;
        return transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    },

    // GET TOTAL EXPENSE
    getTotalExpense: () => {
        const transactions = get().transactions;
        return transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    },

    // GET TOTAL BALANCE
    getTotalBalance: () => {
        return get().getTotalIncome() - get().getTotalExpense();
    },

    // GET MONTHLY TRANSACTIONS
    getMonthlyTransactions: (month, year) => {
        const transactions = get().transactions;
        return transactions.filter(t => t.month === month && t.year === year);
    },

    // GET MONTHLY INCOME
    getMonthlyIncome: (month, year) => {
        const monthlyTransactions = get().getMonthlyTransactions(month, year);
        return monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    },

    // GET MONTHLY EXPENSE
    getMonthlyExpense: (month, year) => {
        const monthlyTransactions = get().getMonthlyTransactions(month, year);
        return monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    },

    // GET MONTHLY BALANCE
    getMonthlyBalance: (month, year) => {
        return get().getMonthlyIncome(month, year) - get().getMonthlyExpense(month, year);
    },

    // GET CASH BALANCE (cash transactions only)
    getCashBalance: () => {
        const transactions = get().transactions;
        return transactions
            .filter(t => t.paymentMethod === 'cash')
            .reduce((sum, t) => {
                return t.type === 'income' ? sum + t.amount : sum - t.amount;
            }, 0);
    },

    // GET DIGITAL BALANCE (card/bank transactions)
    getDigitalBalance: () => {
        const transactions = get().transactions;
        return transactions
            .filter(t => t.paymentMethod !== 'cash')
            .reduce((sum, t) => {
                return t.type === 'income' ? sum + t.amount : sum - t.amount;
            }, 0);
    },

    // CLEAR ALL TRANSACTIONS
    clearTransactions: async () => {
        try {
            await StorageUtils.clearTransactions();
            set({
                transactions: []
            });
            return { success: true };
        } catch (error) {
            console.error("clearTransactions error:", error);
            return {
                success: false,
                message: error.message || "Failed to clear transactions"
            };
        }
    },

    // CLEAR STORE
    clearStore: () => {
        set({
            transactions: [],
            isLoading: false
        });
    }
}));
