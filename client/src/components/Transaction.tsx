import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS, { currency } from '../constants/colors';
import { getCategoryById, getPaymentMethodById } from '../constants/category.constant';

export function TransactionItem({ transaction, runningBalance, onPress, onLongPress }) {
    const categoryInfo = getCategoryById(transaction.category);
    const paymentMethod = getPaymentMethodById(transaction.paymentMethod);
    const isExpense = transaction.type === 'expense';

    const formatAmount = (amount) => {
        const prefix = isExpense ? '-' : '+';
        return `${prefix}${currency.symbol}${amount.toLocaleString(currency.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatBalance = (amount) => {
        return `${currency.symbol}${amount.toLocaleString(currency.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.7}>
            <View style={[styles.iconContainer, { backgroundColor: categoryInfo.color }]}>
                <Ionicons name={categoryInfo.icon} size={18} color="#FFFFFF" />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{categoryInfo.label}</Text>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {paymentMethod.label}{transaction.note ? ` - ${transaction.note}` : ''}
                </Text>
            </View>
            <View style={styles.amountContainer}>
                <Text style={[styles.amount, { color: isExpense ? COLORS.expense : COLORS.income }]}>
                    {formatAmount(transaction.amount)}
                </Text>
                {runningBalance !== undefined && (
                    <Text style={styles.balance}>{formatBalance(runningBalance)}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        marginLeft: 12,
    },
    title: {
        color: COLORS.textPrimary,
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    subtitle: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 17,
        fontWeight: '700',
    },
    balance: {
        color: COLORS.textMuted,
        fontSize: 13,
        marginTop: 2,
    },
});
