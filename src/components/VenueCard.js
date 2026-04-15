import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../theme/theme';

const VenueCard = ({ venue, onPress, isFavorite, onToggleFavorite }) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: venue.image }} style={styles.image} />
                <LinearGradient
                    colors={theme.gradients.overlay}
                    style={styles.gradient}
                />

                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={onToggleFavorite}
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={22}
                        color={isFavorite ? '#FF6B6B' : theme.colors.surface}
                    />
                </TouchableOpacity>

                <LinearGradient
                    colors={theme.gradients.button}
                    style={styles.typeChip}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <Text style={styles.typeText}>{venue.type}</Text>
                </LinearGradient>
            </View>

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {venue.name}
                </Text>
                <View style={styles.locationRow}>
                    <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={14}
                        color={theme.colors.textSecondary}
                    />
                    <Text style={styles.location} numberOfLines={1}>
                        {venue.shortLocation}
                    </Text>
                </View>
                <View style={styles.footer}>
                    <View>
                        <Text style={styles.priceLabel}>Price</Text>
                        <Text style={styles.price}>
                            ₹{venue.price.toLocaleString()}
                            <Text style={styles.priceUnit}>/{venue.priceUnit}</Text>
                        </Text>
                    </View>
                    <View style={styles.bookButtonWrapper}>
                        <LinearGradient
                            colors={theme.gradients.button}
                            style={styles.bookButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.bookButtonText}>Book Now</Text>
                            <MaterialCommunityIcons
                                name="arrow-right"
                                size={16}
                                color={theme.colors.secondary}
                            />
                        </LinearGradient>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        marginHorizontal: theme.spacing.base,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.lg,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.border,
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '60%',
    },
    favoriteButton: {
        position: 'absolute',
        top: theme.spacing.md,
        right: theme.spacing.md,
        width: 44,
        height: 44,
        borderRadius: theme.borderRadius.full,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    ratingBadge: {
        position: 'absolute',
        top: theme.spacing.md,
        left: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.md,
        gap: 4,
        ...theme.shadows.sm,
    },
    rating: {
        fontSize: 12,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    typeChip: {
        position: 'absolute',
        bottom: theme.spacing.md,
        left: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.md,
    },
    typeText: {
        fontSize: theme.fontSizes.xs,
        fontFamily: theme.fonts.bold,
        color: theme.colors.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    content: {
        padding: theme.spacing.base,
    },
    name: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
        marginBottom: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: theme.spacing.md,
    },
    location: {
        flex: 1,
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textSecondary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.sm,
    },
    priceLabel: {
        fontSize: theme.fontSizes.xs,
        fontFamily: theme.fonts.medium,
        color: theme.colors.textLight,
        marginBottom: 2,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    price: {
        fontSize: theme.fontSizes.xl,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    priceUnit: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textSecondary,
    },
    bookButtonWrapper: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    bookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
    },
    bookButtonText: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.bold,
        color: theme.colors.secondary,
    },
});

export default VenueCard;
