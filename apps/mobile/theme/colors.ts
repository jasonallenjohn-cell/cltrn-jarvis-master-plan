// K0RE Brand Colors - Black/Gold/Silver Theme
export const colors = {
    // Base Colors
    black: '#000000',
    dark: '#0A0A0A',
    charcoal: '#141414',
    card: '#1C1C1E',
    cardHover: '#2C2C2E',

    // Brand Colors
    gold: '#D4AF37',
    goldSoft: 'rgba(212,175,55,0.15)',
    goldGlow: 'rgba(212,175,55,0.06)',

    // Neutrals
    silver: '#98989D',
    silverLight: '#C7C7CC',
    white: '#F5F5F7',
    pureWhite: '#FFFFFF',

    // Accent Colors
    green: '#30D158',
    blue: '#0A84FF',
    purple: '#BF5AF2',
    red: '#FF4444',
    yellow: '#FFD60A',

    // UI Elements
    separator: 'rgba(255,255,255,0.06)',
    glass: 'rgba(28,28,30,0.72)',
    glassBorder: 'rgba(255,255,255,0.08)',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

export const typography = {
    sizes: {
        xs: 10,
        sm: 11,
        base: 13,
        md: 14,
        lg: 16,
        xl: 18,
        xxl: 22,
        xxxl: 28,
        display: 36,
    },
    weights: {
        light: '300' as const,
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
};

export const borderRadius = {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 16,
    xxl: 20,
    round: 100,
};
