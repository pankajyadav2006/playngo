import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import theme from '../theme/theme';

const CustomButton = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    style,
    textStyle,
    icon,
}) => {
    const getButtonStyle = () => {
        const baseStyle = [styles.button, styles[size]];

        if (variant === 'primary') {
            baseStyle.push(styles.primaryButton);
        } else if (variant === 'outline') {
            baseStyle.push(styles.outlineButton);
        } else if (variant === 'text') {
            baseStyle.push(styles.textButton);
        }

        if (disabled) {
            baseStyle.push(styles.disabled);
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseStyle = [styles.buttonText];

        if (variant === 'primary') {
            baseStyle.push(styles.primaryText);
        } else if (variant === 'outline') {
            baseStyle.push(styles.outlineText);
        } else if (variant === 'text') {
            baseStyle.push(styles.textButtonText);
        }

        return baseStyle;
    };

    return (
        <TouchableOpacity
            style={[...getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? theme.colors.secondary : theme.colors.primaryAccent}
                />
            ) : (
                <>
                    {icon && icon}
                    <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },

    small: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.base,
        minHeight: 40,
    },
    medium: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        minHeight: 50,
    },
    large: {
        paddingVertical: theme.spacing.base,
        paddingHorizontal: theme.spacing.xl,
        minHeight: 56,
    },

    primaryButton: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.md,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primaryAccent,
    },
    textButton: {
        backgroundColor: 'transparent',
    },

    buttonText: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.bold,
    },
    primaryText: {
        color: theme.colors.secondary,
    },
    outlineText: {
        color: theme.colors.primaryAccent,
    },
    textButtonText: {
        color: theme.colors.primaryAccent,
    },

    disabled: {
        opacity: 0.5,
    },
});

export default CustomButton;
