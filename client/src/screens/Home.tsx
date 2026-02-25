import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import COLORS, { currency } from '../constants/colors';
import { BalanceCard } from '../components/Balance';
import { EXPENSE_CATEGORIES } from '../components/Category';
import { useTransactionStore } from '../store/transaction.store';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export function Home({ navigation }) {
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    const { transactions, loadTransactions, getMonthlyIncome, getMonthlyExpense } = useTransactionStore();

    useEffect(() => {
        loadTransactions();
    }, []);

    const previousMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(prev => prev - 1);
        } else {
            setSelectedMonth(prev => prev - 1);
        }
    };

    const nextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(prev => prev + 1);
        } else {
            setSelectedMonth(prev => prev + 1);
        }
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => t.month === selectedMonth && t.year === selectedYear);
    }, [transactions, selectedMonth, selectedYear]);

    const monthlyIncome = getMonthlyIncome(selectedMonth, selectedYear);
    const monthlyExpense = getMonthlyExpense(selectedMonth, selectedYear);
    const monthlyBalance = monthlyIncome - monthlyExpense;

    // Calculate Top Spending
    const topCategories = useMemo(() => {
        const expenses = filteredTransactions.filter(t => t.type === 'expense');
        const totals: Record<string, number> = {};

        expenses.forEach(t => {
            const catId = t.category || 'other';
            totals[catId] = (totals[catId] || 0) + t.amount;
        });

        const sorted = Object.entries(totals)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4); // Top 4

        return sorted.map(([id, amount]) => {
            const category = EXPENSE_CATEGORIES.find(c => c.id === id) || {
                label: 'Other',
                icon: 'ellipsis-horizontal',
                color: COLORS.categoryOther
            };
            return {
                ...category,
                amount,
                percentage: monthlyExpense > 0 ? (amount / monthlyExpense) * 100 : 0
            };
        });
    }, [filteredTransactions, monthlyExpense]);

    // Recent transactions (last 5)
    const recentTransactions = useMemo(() => {
        return [...filteredTransactions]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
    }, [filteredTransactions]);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.greeting}>My Wallet</Text>
            </View>

            {/* MONTH NAV */}
            <View style={styles.monthNav}>
                <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
                    <Ionicons name="chevron-back" size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <View style={styles.monthContainer}>
                    <Text style={styles.monthText}>{MONTHS[selectedMonth - 1]}</Text>
                    <Text style={styles.yearText}>{selectedYear}</Text>
                </View>
                <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {/* BALANCE CARD */}
                <BalanceCard
                    income={monthlyIncome}
                    expense={monthlyExpense}
                    balance={monthlyBalance}
                    transactions={filteredTransactions}
                    onChartPress={() => navigation.navigate('CategorySummary', {
                        month: selectedMonth,
                        year: selectedYear,
                        type: 'expense'
                    })}
                />

                {/* TOP SPENDING */}
                {topCategories.length > 0 && (
                    <View style={styles.statsSection}>
                        <Text style={styles.sectionTitle}>Top Spending</Text>
                        <View style={styles.topSpendingList}>
                            {topCategories.map((item, index) => (
                                <View key={index} style={styles.spendingItem}>
                                    <View style={[styles.spendingIcon, { backgroundColor: item.color + '20' }]}>
                                        <Ionicons name={item.icon as any} size={18} color={item.color} />
                                    </View>
                                    <View style={styles.spendingDetails}>
                                        <View style={styles.spendingRow}>
                                            <Text style={styles.spendingLabel}>{item.label}</Text>
                                            <Text style={styles.spendingAmount}>
                                                {currency.symbol}{item.amount.toLocaleString()}
                                            </Text>
                                        </View>
                                        <View style={styles.progressBarBg}>
                                            <View
                                                style={[
                                                    styles.progressBarFill,
                                                    {
                                                        width: `${item.percentage}%`,
                                                        backgroundColor: item.color
                                                    }
                                                ]}
                                            />
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
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
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 8,
    },
    greeting: {
        color: COLORS.textPrimary,
        fontSize: 28,
        fontWeight: '700',
    },
    exportButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.cardBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    navButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.cardBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthContainer: {
        alignItems: 'center',
    },
    monthText: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: '600',
    },
    yearText: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 100,
    },
    statsSection: {
        marginTop: 24,
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        color: COLORS.textMuted,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 16,
        textTransform: 'uppercase',
    },
    topSpendingList: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 20,
        padding: 16,
        gap: 16,
    },
    spendingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    spendingIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    spendingDetails: {
        flex: 1,
        gap: 6,
    },
    spendingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    spendingLabel: {
        color: COLORS.textPrimary,
        fontSize: 14,
        fontWeight: '600',
    },
    spendingAmount: {
        color: COLORS.textPrimary,
        fontSize: 14,
        fontWeight: '700',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: COLORS.cardBackgroundLight,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
});

