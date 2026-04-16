import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import theme from '../theme/theme';
import FacilityIcon from '../components/FacilityIcon';
import CustomButton from '../components/CustomButton';

const { width } = Dimensions.get('window');

export default function TurfDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { venue } = route.params;

    return (
        <View style={styles.container}>
            {/* Header - Fixed */}
            <SafeAreaView edges={['top']} style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={24}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Venue Details</Text>
                    <TouchableOpacity style={styles.shareButton}>
                        <MaterialCommunityIcons
                            name="share-variant-outline"
                            size={22}
                            color={theme.colors.text}
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Image with Gradient Overlay */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: venue.image }} style={styles.image} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                        style={styles.imageGradient}
                    />
                    <View style={styles.imageOverlay}>
                    </View>
                </View>

                {/* Content Card */}
                <View style={styles.contentCard}>
                    {/* Name and Type */}
                    <View style={styles.titleSection}>
                        <View style={styles.titleRow}>
                            <View style={styles.titleLeft}>
                                <Text style={styles.name}>{venue.name}</Text>
                                <View style={styles.typeChip}>
                                    <MaterialCommunityIcons
                                        name="soccer"
                                        size={14}
                                        color={theme.colors.primary}
                                    />
                                    <Text style={styles.typeText}>{venue.type}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.locationRow}>
                            <MaterialCommunityIcons
                                name="map-marker"
                                size={18}
                                color={theme.colors.primary}
                            />
                            <Text style={styles.location}>{venue.location}</Text>
                        </View>
                    </View>

                    {/* Price Card */}
                    <View style={styles.priceCard}>
                        <View style={styles.priceInfo}>
                            <Text style={styles.priceLabel}>Starting from</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.price}>₹{venue.price.toLocaleString()}</Text>
                                <Text style={styles.priceUnit}>/ {venue.priceUnit}</Text>
                            </View>
                        </View>
                        <View style={styles.priceDivider} />
                        <View style={styles.sportInfo}>
                            <MaterialCommunityIcons
                                name="account-group"
                                size={20}
                                color={theme.colors.textSecondary}
                            />
                            <Text style={styles.sportText}>{venue.sport}</Text>
                        </View>
                    </View>

                    {/* About */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.aboutText}>{venue.about}</Text>
                    </View>

                    {/* Facilities */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Facilities</Text>
                        <View style={styles.facilitiesGrid}>
                            {venue.facilities.map((facility, index) => (
                                <FacilityIcon key={`${facility.name}-${index}`} facility={facility} />
                            ))}
                        </View>
                    </View>

                    {/* Info Cards */}
                    <View style={styles.infoCards}>
                        <View style={styles.infoCard}>
                            <MaterialCommunityIcons
                                name="clock-outline"
                                size={24}
                                color={theme.colors.primary}
                            />
                            <Text style={styles.infoCardTitle}>Open Hours</Text>
                            <Text style={styles.infoCardText}>6:00 AM - 11:00 PM</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <MaterialCommunityIcons
                                name="phone-outline"
                                size={24}
                                color={theme.colors.primary}
                            />
                            <Text style={styles.infoCardTitle}>Contact</Text>
                            <Text style={styles.infoCardText}>+91 98765 43210</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Button */}
            <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
                <View style={styles.bottomBar}>
                    <View>
                        <Text style={styles.bottomPriceLabel}>Total Price</Text>
                        <Text style={styles.bottomPrice}>₹{venue.price.toLocaleString()}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.bookNowButton}
                        onPress={() => navigation.navigate('Booking', { venue })}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.bookNowText}>Book Now</Text>
                        <MaterialCommunityIcons
                            name="arrow-right"
                            size={20}
                            color={theme.colors.secondary}
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    headerContainer: {
        backgroundColor: theme.colors.surface,
        ...theme.shadows.sm,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareButton: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.text,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    imageContainer: {
        width: width,
        height: 300,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.border,
    },
    imageGradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '60%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: theme.spacing.base,
        left: theme.spacing.base,
        right: theme.spacing.base,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        alignSelf: 'flex-start',
        gap: 6,
    },
    ratingText: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    reviewsText: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textSecondary,
    },
    contentCard: {
        backgroundColor: theme.colors.surface,
        marginTop: -20,
        borderTopLeftRadius: theme.borderRadius['2xl'],
        borderTopRightRadius: theme.borderRadius['2xl'],
        padding: theme.spacing.lg,
    },
    titleSection: {
        marginBottom: theme.spacing.lg,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    titleLeft: {
        flex: 1,
    },
    name: {
        fontSize: theme.fontSizes['2xl'],
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    typeChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.md,
        alignSelf: 'flex-start',
    },
    typeText: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.text,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    location: {
        flex: 1,
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textSecondary,
        lineHeight: 22,
    },
    priceCard: {
        flexDirection: 'row',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.base,
        marginBottom: theme.spacing.lg,
        alignItems: 'center',
    },
    priceInfo: {
        flex: 1,
    },
    priceLabel: {
        fontSize: theme.fontSizes.xs,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textLight,
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: theme.fontSizes['2xl'],
        fontFamily: theme.fonts.bold,
        color: theme.colors.primaryAccent,
    },
    priceUnit: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textSecondary,
        marginLeft: 4,
    },
    priceDivider: {
        width: 1,
        height: 40,
        backgroundColor: theme.colors.divider,
        marginHorizontal: theme.spacing.base,
    },
    sportInfo: {
        alignItems: 'center',
        gap: 4,
    },
    sportText: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.medium,
        color: theme.colors.textSecondary,
    },
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    aboutText: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textSecondary,
        lineHeight: 24,
    },
    facilitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.lg,
    },
    infoCards: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    infoCard: {
        flex: 1,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.base,
        alignItems: 'center',
    },
    infoCardTitle: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.text,
        marginTop: theme.spacing.sm,
        marginBottom: 4,
    },
    infoCardText: {
        fontSize: theme.fontSizes.xs,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.lg,
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.base,
    },
    bottomPriceLabel: {
        fontSize: theme.fontSizes.xs,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textSecondary,
        marginBottom: 4,
    },
    bottomPrice: {
        fontSize: theme.fontSizes.xl,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    bookNowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.lg,
    },
    bookNowText: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.secondary,
    },
});
