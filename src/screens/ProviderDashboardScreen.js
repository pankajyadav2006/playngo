import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { venueAPI, bookingAPI } from '../services/api';
import theme from '../theme/theme';

export default function ProviderDashboardScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalVenues: 0,
        totalBookings: 0,
        recentBookings: [],
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const venuesResponse = await venueAPI.getMyVenues();
            const venues = venuesResponse.data.venues || [];

            let allBookings = [];
            for (const venue of venues) {
                try {
                    const bookingsResponse = await venueAPI.getVenueBookings(venue.id);
                    allBookings = [...allBookings, ...bookingsResponse.data.bookings];
                } catch (error) {
                    console.log('Error loading bookings for venue:', venue.id);
                }
            }

            const recentBookings = allBookings
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            setStats({
                totalVenues: venues.length,
                totalBookings: allBookings.length,
                recentBookings,
            });
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadDashboardData();
    };

    const StatCard = ({ icon, title, value, color, onPress }) => (
        <TouchableOpacity
            style={[styles.statCard, { borderLeftColor: color }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <MaterialCommunityIcons name={icon} size={32} color={color} />
            <View style={styles.statInfo}>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statTitle}>{title}</Text>
            </View>
        </TouchableOpacity>
    );

    const BookingItem = ({ booking }) => (
        <View style={styles.bookingItem}>
            <View style={styles.bookingHeader}>
                <Text style={styles.bookingVenue}>{booking.venue?.name || 'Venue'}</Text>
                <View style={[styles.statusBadge, styles.statusConfirmed]}>
                    <Text style={styles.statusText}>{booking.status}</Text>
                </View>
            </View>
            <View style={styles.bookingDetails}>
                <View style={styles.bookingRow}>
                    <MaterialCommunityIcons name="account" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.bookingText}>{booking.user?.name || 'Customer'}</Text>
                </View>
                <View style={styles.bookingRow}>
                    <MaterialCommunityIcons name="calendar" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.bookingText}>
                        {new Date(booking.date).toLocaleDateString()}
                    </Text>
                </View>
                <View style={styles.bookingRow}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.textSecondary} />
                    <Text style={styles.bookingText}>{booking.time}</Text>
                </View>
            </View>
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
            <LinearGradient
                colors={theme.gradients.header}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>Welcome back!</Text>
                            <Text style={styles.userName}>{user?.name}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={() => navigation.navigate('CreateVenue')}
                        >
                            <MaterialCommunityIcons name="plus" size={24} color={theme.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.statsContainer}>
                    <StatCard
                        icon="store"
                        title="My Venues"
                        value={stats.totalVenues}
                        color={theme.colors.primary}
                        onPress={() => navigation.navigate('MyVenues')}
                    />
                    <StatCard
                        icon="calendar-check"
                        title="Total Bookings"
                        value={stats.totalBookings}
                        color="#10B981"
                    />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Bookings</Text>
                        {stats.recentBookings.length > 0 && (
                            <TouchableOpacity onPress={() => navigation.navigate('MyVenues')}>
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {stats.recentBookings.length === 0 ? (
                        <View style={styles.emptyState}>
                            <MaterialCommunityIcons
                                name="calendar-blank"
                                size={64}
                                color={theme.colors.textLight}
                            />
                            <Text style={styles.emptyText}>No bookings yet</Text>
                            <Text style={styles.emptySubtext}>
                                Create your first venue to start receiving bookings
                            </Text>
                            <TouchableOpacity
                                style={styles.emptyButton}
                                onPress={() => navigation.navigate('CreateVenue')}
                            >
                                <Text style={styles.emptyButtonText}>Create Venue</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        stats.recentBookings.map((booking) => (
                            <BookingItem key={booking.id} booking={booking} />
                        ))
                    )}
                </View>
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
    headerGradient: {
        paddingBottom: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.base,
    },
    greeting: {
        fontSize: theme.fontSizes.base,
        color: theme.colors.secondary,
        opacity: 0.8,
        fontFamily: theme.fonts.regular,
    },
    userName: {
        fontSize: theme.fontSizes['2xl'],
        color: theme.colors.secondary,
        fontFamily: theme.fonts.bold,
        marginTop: 4,
    },
    createButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(184, 255, 60, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        padding: theme.spacing.base,
        gap: theme.spacing.md,
    },
    statCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.base,
        borderLeftWidth: 4,
        ...theme.shadows.sm,
    },
    statInfo: {
        marginTop: theme.spacing.sm,
    },
    statValue: {
        fontSize: theme.fontSizes['3xl'],
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    statTitle: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        marginTop: 4,
    },
    section: {
        padding: theme.spacing.base,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.fontSizes.xl,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    seeAll: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.primaryAccent,
        fontFamily: theme.fonts.semiBold,
    },
    bookingItem: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.base,
        marginBottom: theme.spacing.sm,
        ...theme.shadows.sm,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    bookingVenue: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.text,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
    },
    statusConfirmed: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    statusText: {
        fontSize: theme.fontSizes.xs,
        fontFamily: theme.fonts.semiBold,
        color: '#10B981',
        textTransform: 'uppercase',
    },
    bookingDetails: {
        gap: theme.spacing.xs,
    },
    bookingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    bookingText: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xxl,
    },
    emptyText: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.text,
        marginTop: theme.spacing.base,
    },
    emptySubtext: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.xs,
        marginBottom: theme.spacing.lg,
    },
    emptyButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
    },
    emptyButtonText: {
        color: theme.colors.secondary,
        fontFamily: theme.fonts.semiBold,
        fontSize: theme.fontSizes.base,
    },
});
