import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Linking,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { venueAPI } from '../services/api';
import theme from '../theme/theme';

export default function VenueBookingsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { venue } = route.params || {};

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (venue?.id) {
            loadBookings();
        }
    }, [venue]);

    const loadBookings = async () => {
        try {
            setLoading(true);
            const response = await venueAPI.getVenueBookings(venue.id);
            setBookings(response.data.bookings || []);
        } catch (error) {
            console.error('Failed to load bookings:', error);
            Alert.alert('Error', 'Failed to load bookings for this venue');
        } finally {
            setLoading(false);
        }
    };

    const handleCallCustomer = (phone) => {
        if (phone) {
            Linking.openURL(`tel:${phone}`);
        } else {
            Alert.alert('No Phone', 'Customer phone number not available');
        }
    };

    const BookingCard = ({ booking }) => (
        <View style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
                <View style={styles.customerInfo}>
                    <MaterialCommunityIcons name="account-circle" size={40} color={theme.colors.primary} />
                    <View style={styles.customerDetails}>
                        <Text style={styles.customerName}>{booking.user?.name || 'Customer'}</Text>
                        <Text style={styles.customerPhone}>{booking.user?.phone || 'No phone'}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, booking.status === 'CONFIRMED' ? styles.statusConfirmed : styles.statusCancelled]}>
                    <Text style={[styles.statusText, booking.status === 'CONFIRMED' && styles.statusTextConfirmed]}>
                        {booking.status}
                    </Text>
                </View>
            </View>

            <View style={styles.bookingDetails}>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="calendar" size={18} color={theme.colors.textSecondary} />
                    <Text style={styles.detailText}>
                        {new Date(booking.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="clock-outline" size={18} color={theme.colors.textSecondary} />
                    <Text style={styles.detailText}>{booking.time}</Text>
                </View>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="currency-inr" size={18} color={theme.colors.textSecondary} />
                    <Text style={styles.detailText}>₹{booking.price?.toLocaleString()}</Text>
                </View>
            </View>

            {booking.user?.phone && booking.status === 'CONFIRMED' && (
                <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => handleCallCustomer(booking.user.phone)}
                >
                    <MaterialCommunityIcons name="phone" size={18} color={theme.colors.secondary} />
                    <Text style={styles.callButtonText}>Call Customer</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle} numberOfLines={1}>{venue?.name || 'Venue'}</Text>
                        <Text style={styles.headerSubtitle}>Bookings</Text>
                    </View>
                    <View style={{ width: 24 }} />
                </View>
            </SafeAreaView>

            <ScrollView style={styles.content}>
                {bookings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons
                            name="calendar-blank-multiple"
                            size={80}
                            color={theme.colors.textLight}
                        />
                        <Text style={styles.emptyTitle}>No bookings yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Bookings for this venue will appear here
                        </Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{bookings.length}</Text>
                                <Text style={styles.statLabel}>Total</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {bookings.filter(b => b.status === 'CONFIRMED').length}
                                </Text>
                                <Text style={styles.statLabel}>Confirmed</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>
                                    {bookings.filter(b => b.status === 'CANCELLED').length}
                                </Text>
                                <Text style={styles.statLabel}>Cancelled</Text>
                            </View>
                        </View>

                        {bookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    safeArea: {
        backgroundColor: theme.colors.surface,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    headerInfo: {
        flex: 1,
        marginHorizontal: theme.spacing.md,
    },
    headerTitle: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.text,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        padding: theme.spacing.base,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.base,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.sm,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: theme.fontSizes['2xl'],
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    statLabel: {
        fontSize: theme.fontSizes.xs,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        marginTop: 4,
    },
    bookingCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.base,
        marginBottom: theme.spacing.md,
        ...theme.shadows.md,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    customerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    customerDetails: {
        marginLeft: theme.spacing.sm,
        flex: 1,
    },
    customerName: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.text,
    },
    customerPhone: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
    },
    statusConfirmed: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    statusCancelled: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    statusText: {
        fontSize: theme.fontSizes.xs,
        fontFamily: theme.fonts.semiBold,
        color: '#EF4444',
        textTransform: 'uppercase',
    },
    statusTextConfirmed: {
        color: '#10B981',
    },
    bookingDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.xs,
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginTop: theme.spacing.sm,
    },
    callButtonText: {
        color: theme.colors.secondary,
        fontFamily: theme.fonts.semiBold,
        fontSize: theme.fontSizes.sm,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xxl,
    },
    emptyTitle: {
        fontSize: theme.fontSizes.xl,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.text,
        marginTop: theme.spacing.lg,
    },
    emptySubtitle: {
        fontSize: theme.fontSizes.base,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.sm,
    },
});
