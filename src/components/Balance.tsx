import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS, { currency } from '../constants/colors';
import { useTransactionStore } from '../store/transaction.store';

export function BalanceCard() {
    const { getTotalBalance, getTotalIncome, getTotalExpense } = useTransactionStore();

    const totalBalance = getTotalBalance();
    const totalIncome = getTotalIncome();
    const totalExpense = getTotalExpense();

    // FORMAT CURRENCY
    const formatCurrency = (amount) => {
        return `${currency.symbol}${Math.abs(amount).toLocaleString(currency.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const hasTransactions = totalIncome > 0 || totalExpense > 0;
    const percentChange = hasTransactions
        ? ((totalIncome - totalExpense) / Math.max(totalIncome, 1) * 100).toFixed(1)
        : '0.0';

    return (
        <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <Text style={styles.label}>TOTAL BALANCE</Text>
            <Text style={styles.balance}>{formatCurrency(totalBalance)}</Text>
            {hasTransactions && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {totalBalance >= 0 ? '+' : ''}{percentChange}% this month
                    </Text>
                </View>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 16,
    },
    label: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    balance: {
        color: COLORS.textPrimary,
        fontSize: 40,
        fontWeight: '700',
        letterSpacing: -1,
        marginBottom: 12,
    },
    badge: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
    },
    badgeText: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: '600',
    },
});
