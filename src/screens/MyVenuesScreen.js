import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { venueAPI } from '../services/api';
import theme from '../theme/theme';

export default function MyVenuesScreen() {
    const navigation = useNavigation();
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            loadVenues();
        }, [])
    );

    const loadVenues = async () => {
        try {
            setLoading(true);
            const response = await venueAPI.getMyVenues();
            setVenues(response.data.venues || []);
        } catch (error) {
            console.error('Failed to load venues:', error);
            Alert.alert('Error', 'Failed to load your venues');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadVenues();
    };

    const handleDeleteVenue = (venueId, venueName) => {
        Alert.alert(
            'Delete Venue',
            `Are you sure you want to delete "${venueName}"? This action cannot be undone.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await venueAPI.deleteVenue(venueId);
                            Alert.alert('Success', 'Venue deleted successfully');
                            loadVenues();
                        } catch (error) {
                            console.error('Delete error:', error);
                            Alert.alert('Error', 'Failed to delete venue');
                        }
                    },
                },
            ]
        );
    };

    const VenueCard = ({ venue }) => (
        <View style={styles.venueCard}>
            <Image
                source={{ uri: venue.image }}
                style={styles.venueImage}
            />

            <View style={styles.venueContent}>
                <View style={styles.venueHeader}>
                    <View style={styles.flex}>
                        <Text style={styles.venueName} numberOfLines={1}>{venue.name}</Text>
                        <View style={styles.venueRow}>
                            <MaterialCommunityIcons name="map-marker" size={14} color={theme.colors.textSecondary} />
                            <Text style={styles.venueLocation} numberOfLines={1}>
                                {venue.shortLocation || venue.location}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.venueActions}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => navigation.navigate('CreateVenue', { venue, isEdit: true })}
                        >
                            <MaterialCommunityIcons name="pencil" size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleDeleteVenue(venue.id, venue.name)}
                        >
                            <MaterialCommunityIcons name="delete" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.venueDetails}>
                    <View style={styles.venueTag}>
                        <Text style={styles.venueTagText}>{venue.sport}</Text>
                    </View>
                    {venue.type && (
                        <View style={styles.venueTag}>
                            <Text style={styles.venueTagText}>{venue.type}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.venueFooter}>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>₹{venue.price?.toLocaleString()}</Text>
                        <Text style={styles.priceUnit}>/{venue.priceUnit || '60 min'}</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.viewBookingsBtn}
                        onPress={() => navigation.navigate('VenueBookings', { venue })}
                    >
                        <MaterialCommunityIcons name="calendar-clock" size={18} color={theme.colors.primary} />
                        <Text style={styles.viewBookingsText}>Bookings</Text>
                    </TouchableOpacity>
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
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Venues</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('CreateVenue')}
                    >
                        <MaterialCommunityIcons name="plus" size={24} color={theme.colors.secondary} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {venues.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons
                            name="store-off"
                            size={80}
                            color={theme.colors.textLight}
                        />
                        <Text style={styles.emptyTitle}>No venues yet</Text>
                        <Text style={styles.emptySubtitle}>
                            Create your first venue to start receiving bookings
                        </Text>
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={() => navigation.navigate('CreateVenue')}
                        >
                            <Text style={styles.createButtonText}>Create Venue</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    venues.map((venue) => <VenueCard key={venue.id} venue={venue} />)
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
    headerTitle: {
        fontSize: theme.fontSizes['2xl'],
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: theme.spacing.base,
    },
    venueCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    venueImage: {
        width: '100%',
        height: 160,
        backgroundColor: theme.colors.border,
    },
    venueContent: {
        padding: theme.spacing.base,
    },
    venueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.sm,
    },
    flex: {
        flex: 1,
    },
    venueName: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.text,
        marginBottom: 4,
    },
    venueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    venueLocation: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        flex: 1,
    },
    venueActions: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    venueDetails: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    venueTag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'rgba(184, 255, 60, 0.1)',
        borderRadius: theme.borderRadius.full,
    },
    venueTagText: {
        fontSize: theme.fontSizes.xs,
        color: theme.colors.primaryAccent,
        fontFamily: theme.fonts.bold,
    },
    venueFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        fontSize: theme.fontSizes['2xl'],
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    priceUnit: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
        marginLeft: 4,
    },
    viewBookingsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        backgroundColor: 'rgba(184, 255, 60, 0.1)',
        borderRadius: theme.borderRadius.md,
    },
    viewBookingsText: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.primaryAccent,
        fontFamily: theme.fonts.bold,
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
        marginBottom: theme.spacing.xl,
    },
    createButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
    },
    createButtonText: {
        color: theme.colors.secondary,
        fontFamily: theme.fonts.semiBold,
        fontSize: theme.fontSizes.base,
    },
});
