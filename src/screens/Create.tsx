import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS, { currency } from '../constants/colors';
import { CategorySelector } from '../components/Category';
import { useTransactionStore } from '../store/transaction.store';

// PAYMENT METHODS
const PAYMENT_METHODS = [
    { id: 'cash', label: 'Cash', icon: 'cash-outline' },
    { id: 'credit_card', label: 'Card', icon: 'card-outline' },
    { id: 'bank_transfer', label: 'Bank', icon: 'business-outline' },
];

export function Create({ navigation, route }) {
    // Check if editing existing transaction
    const editTransaction = route?.params?.transaction;
    const isEditing = !!editTransaction;

    const [transactionType, setTransactionType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('other');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
    const [note, setNote] = useState('');

    const { addTransaction, updateTransaction } = useTransactionStore();

    // Pre-fill form when editing
    useEffect(() => {
        if (editTransaction) {
            setTransactionType(editTransaction.type || 'expense');
            setAmount(editTransaction.amount?.toString() || '');
            setSelectedCategory(editTransaction.category || 'other');
            setSelectedPaymentMethod(editTransaction.paymentMethod || 'cash');
            setNote(editTransaction.note || '');
        }
    }, [editTransaction]);

    // HANDLE TYPE CHANGE
    const handleTypeChange = (type) => {
        setTransactionType(type);
        if (!isEditing) {
            setSelectedCategory('other');
        }
    };

    // HANDLE SAVE TRANSACTION
    const handleSave = async () => {
        if (!selectedCategory || !amount || parseFloat(amount) <= 0)
            return;

        const transactionData = {
            type: transactionType,
            amount: parseFloat(amount.replace(/,/g, '')),
            category: selectedCategory,
            title: selectedCategory,
            paymentMethod: selectedPaymentMethod,
            date: isEditing ? editTransaction.date : new Date(),
            note,
        };

        if (isEditing) {
            await updateTransaction(editTransaction.id, transactionData);
        } else {
            await addTransaction(transactionData);
        }

        navigation.navigate('HomeTab');
    };

    const isValid = selectedCategory && amount && parseFloat(amount) > 0;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{isEditing ? 'Edit Transaction' : 'Add Transaction'}</Text>
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* TYPE TOGGLE */}
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.toggleButton, transactionType === 'expense' && styles.toggleButtonActive]}
                        onPress={() => handleTypeChange('expense')}
                    >
                        <Text style={[styles.toggleText, transactionType === 'expense' && styles.toggleTextActive]}>
                            Expense
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleButton, transactionType === 'income' && styles.toggleButtonActive]}
                        onPress={() => handleTypeChange('income')}
                    >
                        <Text style={[styles.toggleText, transactionType === 'income' && styles.toggleTextActive]}>
                            Income
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* AMOUNT INPUT */}
                <View style={styles.amountContainer}>
                    <Text style={styles.amountLabel}>Amount</Text>
                    <View style={styles.amountInputContainer}>
                        <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                        <TextInput
                            style={styles.amountInput}
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="decimal-pad"
                            placeholder="0.00"
                            placeholderTextColor={COLORS.textMuted}
                        />
                    </View>
                </View>

                {/* CATEGORY SELECTOR */}
                <CategorySelector
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    transactionType={transactionType}
                />

                {/* PAYMENT METHOD */}
                <View style={styles.paymentSection}>
                    <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
                    <View style={styles.paymentMethods}>
                        {PAYMENT_METHODS.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                style={[
                                    styles.paymentButton,
                                    selectedPaymentMethod === method.id && styles.paymentButtonActive,
                                ]}
                                onPress={() => setSelectedPaymentMethod(method.id)}
                            >
                                <Ionicons
                                    name={method.icon}
                                    size={16}
                                    color={selectedPaymentMethod === method.id ? COLORS.textPrimary : COLORS.textMuted}
                                />
                                <Text
                                    style={[
                                        styles.paymentLabel,
                                        selectedPaymentMethod === method.id && styles.paymentLabelActive,
                                    ]}
                                >
                                    {method.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* NOTE INPUT */}
                <View style={styles.noteContainer}>
                    <Text style={styles.sectionLabel}>NOTE (OPTIONAL)</Text>
                    <TextInput
                        style={styles.noteInput}
                        placeholder="Add a short description..."
                        placeholderTextColor={COLORS.textMuted}
                        value={note}
                        onChangeText={setNote}
                        multiline
                    />
                </View>

                {/* SAVE BUTTON */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        activeOpacity={0.8}
                        disabled={!isValid}
                    >
                        <Text style={styles.saveButtonText}>Save Transaction</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        paddingBottom: 20,
    },
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        color: COLORS.textPrimary,
        fontSize: 28,
        fontWeight: '700',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.cardBackground,
        borderRadius: 14,
        padding: 4,
        marginBottom: 32,
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    toggleButtonActive: {
        backgroundColor: COLORS.primary,
    },
    toggleText: {
        color: COLORS.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: COLORS.textPrimary,
    },
    amountContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    amountLabel: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginBottom: 8,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencySymbol: {
        color: COLORS.textMuted,
        fontSize: 28,
        fontWeight: '400',
        marginRight: 4,
    },
    amountInput: {
        color: COLORS.textPrimary,
        fontSize: 44,
        fontWeight: '700',
        minWidth: 100,
        textAlign: 'center',
    },
    paymentSection: {
        marginVertical: 20,
    },
    sectionLabel: {
        color: COLORS.textMuted,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 16,
    },
    paymentMethods: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paymentButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.cardBackground,
        paddingVertical: 14,
        borderRadius: 12,
        marginHorizontal: 4,
        gap: 6,
    },
    paymentButtonActive: {
        backgroundColor: COLORS.primary,
    },
    paymentLabel: {
        color: COLORS.textMuted,
        fontSize: 12,
        fontWeight: '600',
    },
    paymentLabelActive: {
        color: COLORS.textPrimary,
    },
    noteContainer: {
        marginVertical: 20,
    },
    noteInput: {
        color: COLORS.textPrimary,
        fontSize: 14,
        padding: 16,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 14,
        minHeight: 80,
        textAlignVertical: 'top',
    },
    footer: {
        paddingVertical: 20,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
    },
    saveButtonDisabled: {
        backgroundColor: COLORS.cardBackgroundLight,
    },
    saveButtonText: {
        color: COLORS.textPrimary,
        fontSize: 15,
        fontWeight: '600',
    },
});
