import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme/theme';

const SportCategoryCard = ({ sport, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.container, isSelected && styles.selected]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {isSelected ? (
                <LinearGradient
                    colors={theme.gradients.primary}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    {sport.trending && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>🔥 Hot</Text>
                        </View>
                    )}
                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons
                                name={sport.icon}
                                size={36}
                                color={theme.colors.secondary}
                            />
                        </View>
                        <Text style={styles.nameSelected}>{sport.name}</Text>
                    </View>
                </LinearGradient>
            ) : (
                <View style={styles.normalContent}>
                    {sport.trending && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>🔥 Hot</Text>
                        </View>
                    )}
                    <View style={styles.content}>
                        <View style={styles.iconContainerNormal}>
                            <MaterialCommunityIcons
                                name={sport.icon}
                                size={36}
                                color={theme.colors.surface}
                            />
                        </View>
                        <Text style={styles.name}>{sport.name}</Text>
                    </View>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 120,
        height: 130,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    selected: {
        ...theme.shadows.glow,
    },
    gradient: {
        flex: 1,
        position: 'relative',
    },
    normalContent: {
        flex: 1,
        backgroundColor: theme.colors.secondary,
        position: 'relative',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: theme.borderRadius.full,
        backgroundColor: 'rgba(26, 29, 41, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainerNormal: {
        width: 56,
        height: 56,
        borderRadius: theme.borderRadius.full,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: theme.colors.surface,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: theme.borderRadius.sm,
        zIndex: 1,
        ...theme.shadows.sm,
    },
    badgeText: {
        fontSize: 9,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.secondary,
    },
    name: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.surface,
        textAlign: 'center',
    },
    nameSelected: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.bold,
        color: theme.colors.secondary,
        textAlign: 'center',
    },
});

export default SportCategoryCard;
