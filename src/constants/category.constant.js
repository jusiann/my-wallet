import COLORS from './colors';

// CATEGORY DEFINITIONS
export const CATEGORIES = {
    food: {
        id: 'food',
        label: 'Food',
        icon: 'restaurant-outline',
        color: COLORS.categoryFood
    },
    market: {
        id: 'market',
        label: 'Market',
        icon: 'cart-outline',
        color: COLORS.categoryMarket
    },
    shop: {
        id: 'shop',
        label: 'Shopping',
        icon: 'bag-outline',
        color: COLORS.categoryShop
    },
    entertainment: {
        id: 'entertainment',
        label: 'Entertainment',
        icon: 'game-controller-outline',
        color: COLORS.categoryEntertainment
    },
    salary: {
        id: 'salary',
        label: 'Salary',
        icon: 'wallet-outline',
        color: COLORS.categorySalary
    },
    freelance: {
        id: 'freelance',
        label: 'Freelance',
        icon: 'laptop-outline',
        color: COLORS.income
    }
};

// PAYMENT METHOD DEFINITIONS
export const PAYMENT_METHODS = {
    cash: {
        id: 'cash',
        label: 'Cash',
        icon: 'cash-outline'
    },
    credit_card: {
        id: 'credit_card',
        label: 'Credit Card',
        icon: 'card-outline'
    },
    bank_transfer: {
        id: 'bank_transfer',
        label: 'Bank Transfer',
        icon: 'swap-horizontal-outline'
    }
};

// GET CATEGORY BY ID
export const getCategoryById = (id) => {
    return CATEGORIES[id] || CATEGORIES.food;
};

// GET PAYMENT METHOD BY ID
export const getPaymentMethodById = (id) => {
    return PAYMENT_METHODS[id] || PAYMENT_METHODS.cash;
};

// GET ALL CATEGORIES AS ARRAY
export const getAllCategories = () => {
    return Object.values(CATEGORIES);
};

// GET ALL PAYMENT METHODS AS ARRAY
export const getAllPaymentMethods = () => {
    return Object.values(PAYMENT_METHODS);
};
