import React, { useState } from 'react';
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

export function Create({ navigation }) {
    const [transactionType, setTransactionType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
    const [note, setNote] = useState('');

    const { addTransaction } = useTransactionStore();

    // HANDLE TYPE CHANGE
    const handleTypeChange = (type) => {
        setTransactionType(type);
        setSelectedCategory(null);
    };

    // HANDLE SAVE TRANSACTION
    const handleSave = async () => {
        if (!selectedCategory || !amount || parseFloat(amount) <= 0)
            return;

        await addTransaction({
            type: transactionType,
            amount: parseFloat(amount.replace(/,/g, '')),
            category: selectedCategory,
            title: selectedCategory,
            paymentMethod: selectedPaymentMethod,
            date: new Date(),
            note,
        });

        navigation.goBack();
    };

    const isValid = selectedCategory && amount && parseFloat(amount) > 0;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Transaction</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            </ScrollView>

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
        fontSize: 17,
        fontWeight: '600',
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
        padding: 20,
        paddingBottom: 40,
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
