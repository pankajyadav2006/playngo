export const theme = {
    colors: {
        primary: '#B8FF3C',
        primaryDark: '#9FE020',
        primaryLight: '#D4FF8A',
        // Darker accent colors for text visibility on light backgrounds
        primaryAccent: '#4A7C00',
        primaryText: '#2D5A00',

        secondary: '#1A1D29',
        secondaryLight: '#2A2F3E',

        background: '#F8F9FA',
        surface: '#FFFFFF',

        text: '#1A1D29',
        textSecondary: '#6B7280',
        textLight: '#9CA3AF',

        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',

        border: '#E5E7EB',
        divider: '#F3F4F6',

        slotAvailable: '#B8FF3C',
        slotBooked: '#EF4444',
        slotSelected: '#B8FF3C',
    },

    // Enhanced gradient configurations for richer visual depth
    gradients: {
        primary: ['#CFFF70', '#B8FF3C', '#9FE020'],
        primaryReverse: ['#9FE020', '#B8FF3C', '#CFFF70'],
        header: ['#D4FF8A', '#B8FF3C', '#8BC926'],
        button: ['#C4FF5C', '#B8FF3C', '#9FE020'],
        card: ['rgba(184, 255, 60, 0.15)', 'rgba(184, 255, 60, 0.05)', 'transparent'],
        overlay: ['transparent', 'rgba(26, 29, 41, 0.4)', 'rgba(26, 29, 41, 0.85)'],
    },

    fonts: {
        // Stack Sans Headline for headings (fallback to Poppins)
        heading: 'StackSansHeadline_400Regular',
        headingMedium: 'StackSansHeadline_500Medium',
        headingSemiBold: 'StackSansHeadline_600SemiBold',
        headingBold: 'StackSansHeadline_700Bold',
        // Inter for body text
        regular: 'Inter_400Regular',
        medium: 'Inter_500Medium',
        semiBold: 'Inter_600SemiBold',
        bold: 'Inter_700Bold',
        // Legacy references (for compatibility)
        headingRegular: 'Poppins_400Regular',
    },

    fontSizes: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 42,
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        base: 16,
        lg: 20,
        xl: 24,
        '2xl': 32,
        '3xl': 40,
        '4xl': 48,
    },

    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        '2xl': 24,
        full: 9999,
    },

    // Animation timing and easing constants
    animation: {
        timing: {
            fast: 150,
            normal: 300,
            slow: 500,
            verySlow: 800,
        },
        easing: {
            // These are string identifiers for use with Animated or Reanimated
            smooth: 'ease-in-out',
            bouncy: 'spring',
            snappy: 'ease-out',
        },
        spring: {
            gentle: { friction: 10, tension: 40 },
            bouncy: { friction: 5, tension: 80 },
            snappy: { friction: 8, tension: 120 },
        },
    },

    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
        },
        xl: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
        },
        glow: {
            shadowColor: '#B8FF3C',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 10,
        },
    },
};

export default theme;
