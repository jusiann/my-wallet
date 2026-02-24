import { File, Paths } from 'expo-file-system/next';
import * as Sharing from 'expo-sharing';
import { getCategoryById, getPaymentMethodById } from '../constants/category.constant';

interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    paymentMethod: string;
    note?: string;
    date: string;
    day: number;
    month: number;
    year: number;
}

export async function exportTransactionsToCSV(
    transactions: Transaction[],
    fileName: string = 'transactions'
): Promise<boolean> {
    try {
        // Create CSV header
        const header = ['Date', 'Type', 'Category', 'Payment Method', 'Amount', 'Note'];

        // Create CSV rows
        const rows = transactions.map(t => {
            const categoryInfo = getCategoryById(t.category);
            const paymentMethod = getPaymentMethodById(t.paymentMethod);

            return [
                t.date,
                t.type,
                categoryInfo.label,
                paymentMethod.label,
                t.amount.toFixed(2),
                t.note || ''
            ];
        });

        // Combine header and rows
        const csvContent = [header, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        // Generate file and write content
        const file = new File(Paths.document, `${fileName}.csv`);
        file.write(csvContent);

        // Check if sharing is available
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(file.uri, {
                mimeType: 'text/csv',
                dialogTitle: 'Export Transactions',
            });
            return true;
        } else {
            console.warn('Sharing is not available on this device');
            return false;
        }
    } catch (error) {
        console.error('Error exporting CSV:', error);
        return false;
    }
}

export async function exportMonthlyReport(
    transactions: Transaction[],
    month: number,
    year: number
): Promise<boolean> {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthlyTransactions = transactions.filter(
        t => t.month === month && t.year === year
    );

    const fileName = `${monthNames[month - 1]}_${year}_transactions`;
    return exportTransactionsToCSV(monthlyTransactions, fileName);
}
