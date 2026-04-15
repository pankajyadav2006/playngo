import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../theme/theme';

const FacilityIcon = ({ facility }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                    name={facility.icon}
                    size={22}
                    color={theme.colors.primary}
                />
            </View>
            <Text style={styles.label} numberOfLines={2}>{facility.name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: 70,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
        borderWidth: 1.5,
        borderColor: theme.colors.primary + '20',
    },
    label: {
        fontSize: 11,
        fontFamily: theme.fonts.medium,
        color: theme.colors.text,
        textAlign: 'center',
    },
});

export default FacilityIcon;
