// THEME COLORS - REFINED FOR CLEANER LOOK
const COLORS = {
    // BACKGROUNDS
    background: '#0F0F1A',
    cardBackground: '#1A1A2E',
    cardBackgroundLight: '#252542',

    // PRIMARY COLORS
    primary: '#7C3AED', // Strong Purple
    primaryLight: '#A78BFA',
    primaryDark: '#5B21B6',

    // GRADIENT COLORS FOR BALANCE CARD
    gradientStart: '#4C1D95',
    gradientMiddle: '#6D28D9',
    gradientEnd: '#8B5CF6',

    // STATUS COLORS
    income: '#10B981', // Keep green for income logic, but maybe mute it? No, standard convention is better.
    incomeLight: 'rgba(16, 185, 129, 0.12)',
    expense: '#F43F5E',
    expenseLight: 'rgba(244, 63, 94, 0.12)',

    // TEXT COLORS
    textPrimary: '#F3E8FF', // Soft purple-white
    textSecondary: '#D8B4FE',
    textMuted: '#9384B6',

    // BORDER COLORS
    border: 'rgba(139, 92, 246, 0.2)',

    // CATEGORY COLORS - ALL PURPLE TONES
    categoryFood: '#C084FC', // Light Purple
    categoryMarket: '#A855F7', // Medium Purple
    categoryShop: '#9333EA', // Deep Purple
    categoryRent: '#7E22CE', // Dark Purple
    categoryEntertainment: '#D8B4FE', // Pale Purple
    categoryTransport: '#6B21A8', // Very Dark Purple
    categoryHealth: '#E9D5FF', // Very Light Purple
    categorySalary: '#8B5CF6',
    categoryOther: '#581C87',
};

// CURRENCY SETTINGS
export const currency = {
    symbol: '₺',
    code: 'TRY',
    locale: 'tr-TR',
};

export default COLORS;
