import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import COLORS, { currency } from '../constants/colors';
import { BalanceCard } from '../components/Balance';
import { SummaryCard } from '../components/Summary';
import { TransactionItem } from '../components/Transaction';
import { useTransactionStore } from '../store/transaction.store';

// MONTHS ARRAY
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export function Home({ navigation }) {
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());

    const { transactions, loadTransactions, getMonthlyIncome, getMonthlyExpense, getTotalBalance, getCashBalance, getDigitalBalance } = useTransactionStore();

    // LOAD TRANSACTIONS ON MOUNT
    useEffect(() => {
        loadTransactions();
    }, []);

    const currentMonthLabel = `${MONTHS[selectedMonth - 1]} ${selectedYear}`;

    // NAVIGATE TO PREVIOUS MONTH
    const previousMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(prev => prev - 1);
        } else {
            setSelectedMonth(prev => prev - 1);
        }
    };

    // NAVIGATE TO NEXT MONTH
    const nextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(prev => prev + 1);
        } else {
            setSelectedMonth(prev => prev + 1);
        }
    };

    // FILTER TRANSACTIONS BY SELECTED MONTH AND YEAR
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => t.month === selectedMonth && t.year === selectedYear);
    }, [transactions, selectedMonth, selectedYear]);

    // CALCULATE MONTHLY TOTALS
    const monthlyIncome = getMonthlyIncome(selectedMonth, selectedYear);
    const monthlyExpense = getMonthlyExpense(selectedMonth, selectedYear);
    const monthlyBalance = monthlyIncome - monthlyExpense;

    // CALCULATE TOTAL BALANCES
    const totalBalance = getTotalBalance();
    const cashBalance = getCashBalance();
    const digitalBalance = getDigitalBalance();

    // GROUP TRANSACTIONS BY DATE AND CALCULATE RUNNING BALANCE
    const { sections, runningBalances } = useMemo(() => {
        const today = new Date();
        const yesterday = new Date(Date.now() - 86400000);

        // SORT TRANSACTIONS BY DATE (NEWEST FIRST)
        const sortedTransactions = [...filteredTransactions].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // CALCULATE RUNNING BALANCE (CUMULATIVE FROM OLDEST TO NEWEST)
        const balances = {};
        let runningTotal = 0;

        const reversedTransactions = [...sortedTransactions].reverse();
        reversedTransactions.forEach(t => {
            runningTotal += t.type === 'income' ? t.amount : -t.amount;
            balances[t.id] = runningTotal;
        });

        // GROUP BY DATE
        const groups = {};

        sortedTransactions.forEach(transaction => {
            const transactionDate = new Date(transaction.date);

            let label;
            if (transactionDate.toDateString() === today.toDateString()) {
                label = `TODAY, ${transactionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`;
            } else if (transactionDate.toDateString() === yesterday.toDateString()) {
                label = `YESTERDAY, ${transactionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}`;
            } else {
                label = transactionDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
            }

            if (!groups[label]) {
                groups[label] = [];
            }
            groups[label].push(transaction);
        });

        return {
            sections: Object.entries(groups).map(([title, data]) => ({ title, data })),
            runningBalances: balances,
        };
    }, [filteredTransactions]);

    // EMPTY STATE COMPONENT
    function EmptyState() {
        return (
            <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                    <Ionicons name="calendar-outline" size={48} color={COLORS.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>No transactions</Text>
                <Text style={styles.emptySubtitle}>
                    No transactions found for {MONTHS[selectedMonth - 1]} {selectedYear}
                </Text>
            </View>
        );
    }

    // FORMAT CURRENCY
    const formatCurrency = (amount) => {
        return `${currency.symbol}${Math.abs(amount).toLocaleString(currency.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* MONTH NAVIGATION */}
            <View style={styles.monthNav}>
                <TouchableOpacity onPress={previousMonth} style={styles.navButton}>
                    <Ionicons name="chevron-back" size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.monthText}>{currentMonthLabel}</Text>
                <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
                    <Ionicons name="chevron-forward" size={22} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* BALANCE CARD FOR SELECTED MONTH */}
            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>MONTHLY BALANCE</Text>
                <Text style={[
                    styles.balanceAmount,
                    { color: monthlyBalance === 0 ? COLORS.textMuted : monthlyBalance > 0 ? COLORS.income : COLORS.expense }
                ]}>
                    {monthlyBalance > 0 ? '+' : monthlyBalance < 0 ? '-' : ''}{formatCurrency(monthlyBalance)}
                </Text>
            </View>

            {/* SUMMARY CARDS */}
            <View style={styles.summaryContainer}>
                <SummaryCard type="income" amount={monthlyIncome} />
                <SummaryCard type="expense" amount={monthlyExpense} />
            </View>

            {/* TRANSACTION LIST */}
            {filteredTransactions.length === 0 ? (
                <EmptyState />
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TransactionItem
                            transaction={item}
                            runningBalance={runningBalances[item.id]}
                        />
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.sectionHeader}>{title}</Text>
                    )}
                    style={styles.transactionList}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    stickySectionHeadersEnabled={false}
                />
            )}

            {/* ADD BUTTON */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Create')}>
                <Ionicons name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 8,
    },
    navButton: {
        padding: 8,
    },
    monthText: {
        color: COLORS.textPrimary,
        fontSize: 17,
        fontWeight: '600',
    },
    balanceCard: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 24,
        padding: 28,
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 16,
    },
    balanceLabel: {
        color: COLORS.textMuted,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: '700',
        letterSpacing: -1,
    },
    summaryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 14,
        marginTop: 8,
    },
    transactionList: {
        flex: 1,
        marginTop: 20,
    },
    listContent: {
        paddingBottom: 100,
    },
    sectionHeader: {
        color: COLORS.textMuted,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 0.5,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 8,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 100,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.cardBackground,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtitle: {
        color: COLORS.textMuted,
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    fab: {
        position: 'absolute',
        bottom: 32,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    assetsSection: {
        paddingHorizontal: 20,
        marginTop: 16,
    },
    sectionTitle: {
        color: COLORS.textMuted,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 12,
    },
    assetCardsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    assetCard: {
        flex: 1,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 16,
        padding: 14,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    assetIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: COLORS.cardBackgroundLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    assetLabel: {
        color: COLORS.textMuted,
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 4,
    },
    assetAmount: {
        fontSize: 14,
        fontWeight: '700',
    },
});
