import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import COLORS, { currency } from '../constants/colors';
import { TransactionItem } from '../components/Transaction';
import { DeleteModal } from '../components/DeleteModal';
import { useTransactionStore } from '../store/transaction.store';
import { getCategoryById } from '../constants/category.constant';
import { exportMonthlyReport } from '../utils/export.utils';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export function List({ navigation }) {
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

    const { transactions, loadTransactions, deleteTransaction } = useTransactionStore();

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

    const handleExport = async () => {
        const success = await exportMonthlyReport(transactions, selectedMonth, selectedYear);
        if (success) {
            Alert.alert('Success', 'Transactions exported successfully!');
        } else {
            Alert.alert('Error', 'Failed to export transactions. Please try again.');
        }
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const matchesMonth = t.month === selectedMonth && t.year === selectedYear;
            if (!matchesMonth) return false;

            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const noteMatch = t.note?.toLowerCase().includes(query);
                const categoryMatch = t.category?.toLowerCase().includes(query);
                return noteMatch || categoryMatch;
            }
            return true;
        });
    }, [transactions, selectedMonth, selectedYear, searchQuery]);

    const { sections, runningBalances: calculatedBalances } = useMemo(() => {
        const today = new Date();
        const yesterday = new Date(Date.now() - 86400000);

        const grouped = {};
        const sorted = [...filteredTransactions].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const getLocalDateKey = (d: Date) => {
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        };

        sorted.forEach(t => {
            // Group by local date key
            const dateKey = getLocalDateKey(new Date(t.date));
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(t);
        });

        // Calculate running balances
        const allSorted = [...transactions].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        let cumulative = 0;
        const balances = {};
        allSorted.forEach(t => {
            cumulative += t.type === 'income' ? t.amount : -t.amount;
            balances[t.id] = cumulative;
        });

        const result = Object.entries(grouped)
            .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()) // Sort groups by date descending
            .map(([dateStr, data]) => {
                const date = new Date(dateStr);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                const datePart = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

                let title = `${dayName}, ${datePart}`;

                const todayKey = getLocalDateKey(today);
                const yesterdayKey = getLocalDateKey(yesterday);

                if (dateStr === todayKey) {
                    title = `Today, ${datePart}`;
                } else if (dateStr === yesterdayKey) {
                    title = `Yesterday, ${datePart}`;
                }

                return { title, data };
            });

        return { sections: result, runningBalances: balances };
    }, [filteredTransactions, transactions]);



    const handleDelete = () => {
        if (transactionToDelete) {
            deleteTransaction(transactionToDelete);
            setTransactionToDelete(null);
            setDeleteModalVisible(false);
        }
    };

    const EmptyState = () => (
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

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Transactions</Text>
                <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
                    <Ionicons name="share-outline" size={20} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

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

            {/* SEARCH BAR */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by note or category..."
                    placeholderTextColor={COLORS.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
                    </TouchableOpacity>
                )}
            </View>

            {/* TRANSACTION LIST */}
            {sections.length === 0 ? (
                <EmptyState />
            ) : (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TransactionItem
                            transaction={item}
                            runningBalance={calculatedBalances[item.id]}
                            onPress={() => {
                                setTransactionToDelete(item.id);
                                setDeleteModalVisible(true);
                            }}
                            onLongPress={() => {
                                setTransactionToDelete(item.id);
                                setDeleteModalVisible(true);
                            }}
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

            <DeleteModal
                visible={deleteModalVisible}
                onCancel={() => {
                    setTransactionToDelete(null);
                    setDeleteModalVisible(false);
                }}
                onConfirm={handleDelete}
            />
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
    exportButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.cardBackground,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: COLORS.textPrimary,
        fontSize: 28,
        fontWeight: '700',
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.cardBackground,
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 14,
        padding: 0,
    },
    transactionList: {
        flex: 1,
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
        paddingTop: 16,
        paddingBottom: 8,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.cardBackground,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
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
    },
});
