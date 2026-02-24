import AsyncStorage from "@react-native-async-storage/async-storage";

export class StorageUtils {
    static KEYS = {
        TRANSACTIONS: "@my_wallet_transactions"
    };

    static async saveTransactions(transactions) {
        try {
            const serialized = transactions.map(t => ({
                ...t,
                date: t.date.toISOString(),
                day: t.date.getDate(),
                month: t.date.getMonth() + 1,
                year: t.date.getFullYear()
            }));
            await AsyncStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(serialized));
            return { success: true };
        } catch (error) {
            console.error("StorageUtils.saveTransactions - Error:", error);
            return { success: false, error: error.message };
        }
    }

    static async loadTransactions() {
        try {
            const jsonValue = await AsyncStorage.getItem(this.KEYS.TRANSACTIONS);
            if (!jsonValue)
                return [];

            const stored = JSON.parse(jsonValue);
            return stored.map(t => ({
                ...t,
                date: new Date(t.date)
            }));
        } catch (error) {
            console.error("StorageUtils.loadTransactions - Error:", error);
            return [];
        }
    }

    static async clearTransactions() {
        try {
            await AsyncStorage.removeItem(this.KEYS.TRANSACTIONS);
            return { success: true };
        } catch (error) {
            console.error("StorageUtils.clearTransactions - Error:", error);
            return { success: false, error: error.message };
        }
    }
}

export default StorageUtils;
