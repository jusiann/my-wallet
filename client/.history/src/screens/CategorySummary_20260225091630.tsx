import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import COLORS, { currency } from '../constants/colors';
import { getCategoryById, CATEGORIES } from '../constants/category.constant';
import { useTransactionStore } from '../store/transaction.store';

export function CategorySummary({ navigation, route }) {
    const { month, year, type = 'expense' } = route?.params || {};
    const { transactions } = useTransactionStore();

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t =>
            t.month === month &&
            t.year === year &&
            t.type === type
        );
    }, [transactions, month, year, type]);

    const categoryData = useMemo(() => {
        const totals = {};
        let grandTotal = 0;

        filteredTransactions.forEach(t => {
            if (!totals[t.category]) {
                totals[t.category] = 0;
            }
            totals[t.category] += t.amount;
            grandTotal += t.amount;
        });

        // Convert to array with percentages
        const categories = Object.entries(totals)
            .map(([categoryId, amount]) => {
                const categoryInfo = getCategoryById(categoryId);
                return {
                    id: categoryId,
                    label: categoryInfo.label,
                    icon: categoryInfo.icon,
                    color: categoryInfo.color,
                    amount: amount,
                    percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0
                };
            })
            .sort((a, b) => b.amount - a.amount);

        return { categories, grandTotal };
    }, [filteredTransactions]);

    const formatCurrency = (amount) => {
        return `${currency.symbol}${amount.toLocaleString(currency.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const MONTHS = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {type === 'expense' ? 'Expenses' : 'Income'} by Category
                </Text>
                <View style={styles.placeholder} />
            </View>

            {/* MONTH LABEL */}
            <View style={styles.totalContainer}>
                <Text style={styles.monthLabel}>
                    {MONTHS[month - 1]} {year}
                </Text>

                {/* TOTAL */}
                <Text style={styles.totalLabel}>Total {type === 'expense' ? 'Expenses' : 'Income'}</Text>
                <Text style={[styles.totalAmount, { color: type === 'expense' ? COLORS.expense : COLORS.income }]}>
                    {formatCurrency(categoryData.grandTotal || 0)}
                </Text>
            </View>

            {/* CATEGORY LIST */}
                {categoryData.categories.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No transactions found</Text>
                    </View>
                ) : (
                    categoryData.categories.map((cat) => (
                        <View key={cat.id} style={styles.categoryItem}>
                            <View style={[styles.iconContainer, { backgroundColor: cat.color }]}>
                                <Ionicons name={cat.icon} size={18} color="#FFFFFF" />
                            </View>
                            <View style={styles.categoryInfo}>
                                <Text style={styles.categoryName}>{cat.label}</Text>
                                <View style={styles.progressBarContainer}>
                                    <View
                                        style={[
                                            styles.progressBar,
                                            { width: `${cat.percentage}%`, backgroundColor: cat.color }
                                        ]}
                                    />
                                </View>
                            </View>
                            <View style={styles.categoryAmountContainer}>
                                <Text style={styles.categoryAmount}>{formatCurrency(cat.amount)}</Text>
                                <Text style={styles.categoryPercentage}>{cat.percentage.toFixed(1)}%</Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.cardBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: '600',
    },
    placeholder: {
        width: 40,
    },
    monthLabel: {
        color: COLORS.textMuted,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    totalContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        marginHorizontal: 20,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        marginBottom: 20,
    },
    totalLabel: {
        color: COLORS.textMuted,
        fontSize: 13,
        marginBottom: 8,
    },
    totalAmount: {
        fontSize: 32,
        fontWeight: '700',
    },
    categoryList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBackground,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryInfo: {
        flex: 1,
        marginLeft: 12,
    },
    categoryName: {
        color: COLORS.textPrimary,
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 6,
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: COLORS.border,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
    categoryAmountContainer: {
        alignItems: 'flex-end',
        marginLeft: 12,
    },
    categoryAmount: {
        color: COLORS.textPrimary,
        fontSize: 15,
        fontWeight: '600',
    },
    categoryPercentage: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
});
