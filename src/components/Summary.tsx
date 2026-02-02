import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS, { currency } from '../constants/colors';

export function SummaryCard({ type, amount }) {
    const isIncome = type === 'income';

    // FORMAT CURRENCY
    const formatCurrency = (value) => {
        return `${currency.symbol}${value.toLocaleString(currency.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: isIncome ? COLORS.incomeLight : COLORS.expenseLight }]}>
                    <Ionicons
                        name={isIncome ? 'arrow-down' : 'arrow-up'}
                        size={16}
                        color={isIncome ? COLORS.income : COLORS.expense}
                    />
                </View>
                <Text style={styles.label}>{isIncome ? 'Income' : 'Expense'}</Text>
            </View>
            <Text style={styles.amount}>{formatCurrency(amount)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 20,
        padding: 18,
        marginHorizontal: 6,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    iconContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    label: {
        color: COLORS.textSecondary,
        fontSize: 13,
        fontWeight: '500',
    },
    amount: {
        color: COLORS.textPrimary,
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
});
