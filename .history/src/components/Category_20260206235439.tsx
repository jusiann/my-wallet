import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

export const EXPENSE_CATEGORIES = [
    { id: 'food', label: 'Food', icon: 'restaurant', color: COLORS.categoryFood },
    { id: 'market', label: 'Market', icon: 'cart', color: COLORS.categoryMarket },
    { id: 'shop', label: 'Shopping', icon: 'bag-handle', color: COLORS.categoryShop },
    { id: 'entertainment', label: 'Entertainment', icon: 'game-controller', color: COLORS.categoryEntertainment },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal', color: COLORS.categoryOther },
];

export const INCOME_CATEGORIES = [
    { id: 'salary', label: 'Salary', icon: 'cash', color: COLORS.income },
    { id: 'freelance', label: 'Cash', icon: 'cash', color: COLORS.categoryShop },
    { id: 'other', label: 'Other', icon: 'ellipsis-horizontal', color: COLORS.categoryOther },
];

export function CategorySelector({ selectedCategory, onSelectCategory, transactionType }) {
    const categoriesToShow = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>CATEGORY</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {categoriesToShow.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryItem}
                        onPress={() => onSelectCategory(category.id)}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: selectedCategory === category.id ? category.color : COLORS.cardBackgroundLight },
                            ]}
                        >
                            <Ionicons
                                name={category.icon}
                                size={20}
                                color={selectedCategory === category.id ? '#FFFFFF' : COLORS.textMuted}
                            />
                        </View>
                        <Text
                            style={[
                                styles.categoryLabel,
                                selectedCategory === category.id && { color: COLORS.textPrimary },
                            ]}
                        >
                            {category.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    label: {
        color: COLORS.textMuted,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 16,
    },
    scrollContent: {
        paddingRight: 20,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: 16,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    categoryLabel: {
        color: COLORS.textMuted,
        fontSize: 11,
        fontWeight: '500',
    },
});
