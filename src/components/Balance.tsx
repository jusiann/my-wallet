import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import COLORS, { currency } from '../constants/colors';
import { EXPENSE_CATEGORIES } from './Category';

const { width } = Dimensions.get('window');
const CHART_SIZE = width * 0.7;
const STROKE_WIDTH = 28;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    date: string;
    month: number;
    year: number;
}

interface BalanceCardProps {
    income?: number;
    expense?: number;
    balance?: number;
    transactions?: Transaction[];
    onChartPress?: () => void;
}

export function BalanceCard({
    income = 0,
    expense = 0,
    balance = 0,
    transactions = [],
    onChartPress
}: BalanceCardProps) {

    // 1. Calculate Spending Ratio (Arc Limit)
    // Handle edge cases: if income is 0, show full arc if there are expenses
    const spendingRatio = income > 0 ? Math.min(expense / income, 1) : (expense > 0 ? 1 : 0);
    const totalArcLength = CIRCUMFERENCE * spendingRatio;

    // 2. Prepare Category Segments - ONLY from expense transactions
    const segments = useMemo(() => {
        // Filter to only expense transactions
        const expenseTransactions = transactions.filter(t => t.type === 'expense');
        const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

        if (totalExpense === 0) return [];

        // Aggregate expenses by category
        const categoryTotals: Record<string, number> = {};
        expenseTransactions.forEach(t => {
            const catId = t.category || 'other';
            categoryTotals[catId] = (categoryTotals[catId] || 0) + t.amount;
        });

        let currentStart = 0;

        return EXPENSE_CATEGORIES.map(cat => {
            const amount = categoryTotals[cat.id] || 0;
            if (amount === 0) return null;

            const shareOfExpense = amount / totalExpense;
            const segmentLength = totalArcLength * shareOfExpense;
            const dashArray = `${segmentLength} ${CIRCUMFERENCE - segmentLength}`;
            const rotationOffset = (currentStart / CIRCUMFERENCE) * 360;

            currentStart += segmentLength;

            return {
                key: cat.id,
                color: cat.color,
                dashArray,
                rotation: -90 + rotationOffset,
            };
        }).filter((seg): seg is NonNullable<typeof seg> => seg !== null);
    }, [transactions, totalArcLength]);


    const formatCurrency = (amount: number) => {
        const prefix = amount < 0 ? '-' : '';
        return `${prefix}${currency.symbol}${Math.abs(amount).toLocaleString(currency.locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    // Determine balance color
    const balanceColor = balance < 0 ? COLORS.expense : COLORS.textPrimary;

    // Subtitle text
    const getSubtitle = () => {
        if (income === 0 && expense === 0) return 'No transactions yet';
        if (income === 0) return 'No income recorded';
        return `${(spendingRatio * 100).toFixed(0)}% of income spent`;
    };

    return (
        <View style={styles.container}>
            {/* Main Gauge Chart */}
            <TouchableOpacity
                style={styles.chartWrapper}
                onPress={onChartPress}
                activeOpacity={onChartPress ? 0.8 : 1}
            >
                <Svg width={CHART_SIZE} height={CHART_SIZE} viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
                    {/* Background Track */}
                    <Circle
                        cx={CHART_SIZE / 2}
                        cy={CHART_SIZE / 2}
                        r={RADIUS}
                        stroke={COLORS.cardBackgroundLight}
                        strokeWidth={STROKE_WIDTH}
                        fill="transparent"
                    />

                    {/* Category Segments */}
                    {segments.map((segment) => (
                        <Circle
                            key={segment.key}
                            cx={CHART_SIZE / 2}
                            cy={CHART_SIZE / 2}
                            r={RADIUS}
                            stroke={segment.color}
                            strokeWidth={STROKE_WIDTH}
                            fill="transparent"
                            strokeDasharray={segment.dashArray}
                            strokeLinecap="butt"
                            origin={`${CHART_SIZE / 2}, ${CHART_SIZE / 2}`}
                            rotation={segment.rotation}
                        />
                    ))}

                    {/* Over-budget indicator */}
                    {income > 0 && expense > income && (
                        <Circle
                            cx={CHART_SIZE / 2}
                            cy={CHART_SIZE / 2}
                            r={RADIUS}
                            stroke={COLORS.expense}
                            strokeWidth={3}
                            fill="transparent"
                            opacity={0.6}
                        />
                    )}
                </Svg>

                <View style={styles.innerContent}>
                    <Text style={styles.label}>AVAILABLE BALANCE</Text>
                    <Text style={[styles.balance, { color: balanceColor }]}>
                        {formatCurrency(balance)}
                    </Text>
                    <Text style={styles.subLabel}>{getSubtitle()}</Text>
                </View>
            </TouchableOpacity>

            {/* Quick Stats Row */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <View style={[styles.iconBox, { backgroundColor: COLORS.incomeLight }]}>
                        <Ionicons name="arrow-up" size={16} color={COLORS.income} />
                    </View>
                    <View style={styles.statTextContainer}>
                        <Text style={styles.statLabel}>Income</Text>
                        <Text style={[styles.statValue, { color: COLORS.income }]}>{formatCurrency(income)}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.statItem}>
                    <View style={[styles.iconBox, { backgroundColor: COLORS.expenseLight }]}>
                        <Ionicons name="arrow-down" size={16} color={COLORS.expense} />
                    </View>
                    <View style={styles.statTextContainer}>
                        <Text style={styles.statLabel}>Expense</Text>
                        <Text style={[styles.statValue, { color: COLORS.expense }]}>{formatCurrency(expense)}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 24,
        padding: 24,
        marginHorizontal: 20,
        marginVertical: 16,
        alignItems: 'center',
    },
    chartWrapper: {
        width: CHART_SIZE,
        height: CHART_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 24,
    },
    innerContent: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        color: COLORS.textMuted,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    balance: {
        color: COLORS.textPrimary,
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    subLabel: {
        color: COLORS.textMuted,
        fontSize: 13,
        fontWeight: '500',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    statTextContainer: {
        alignItems: 'flex-start',
    },
    statLabel: {
        color: COLORS.textMuted,
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 3,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '700',
    },
    divider: {
        width: 1,
        height: 36,
        backgroundColor: COLORS.cardBackgroundLight,
        marginHorizontal: 10,
    },
});
