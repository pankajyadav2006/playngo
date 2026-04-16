import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import theme from '../theme/theme';

export default function MyBookingsScreen() {
  const { getActiveBookings, getPastBookings, cancelBooking, loadBookings } = useApp();
  const [cancellingId, setCancellingId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  }, [loadBookings]);

  const activeBookings = getActiveBookings();
  const pastBookings = getPastBookings();

  const handleCancelBooking = async (bookingId, venueName) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking at ${venueName}?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setCancellingId(bookingId);
            const result = await cancelBooking(bookingId);
            setCancellingId(null);

            if (result.success) {
              Alert.alert('Cancelled', 'Your booking has been cancelled successfully');
            } else {
              Alert.alert('Error', result.error || 'Failed to cancel booking');
            }
          },
        },
      ]
    );
  };

  const renderEmptyState = (message) => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="calendar-blank"
        size={80}
        color={theme.colors.textLight}
      />
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  const renderBookingCard = (booking, isPast = false) => (
    <View key={booking.id} style={styles.bookingCard}>
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: booking.venueImage || booking.venue?.image }} style={styles.cardImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.cardGradient}
        />
        {!isPast && booking.status === 'CONFIRMED' && (
          <View style={styles.statusBadge}>
            <MaterialCommunityIcons name="check-circle" size={14} color="#10B981" />
            <Text style={styles.statusText}>Confirmed</Text>
          </View>
        )}
        {booking.status === 'CANCELLED' && (
          <View style={[styles.statusBadge, styles.cancelledStatusBadge]}>
            <MaterialCommunityIcons name="close-circle" size={14} color="#EF4444" />
            <Text style={styles.cancelledStatusText}>Cancelled</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.venueName} numberOfLines={1}>
          {booking.venueName || booking.venue?.name}
        </Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.infoText}>
              {new Date(booking.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.infoText}>{booking.time}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.price}>₹{booking.price.toLocaleString()}</Text>
          </View>

          {!isPast && booking.status === 'CONFIRMED' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelBooking(booking.id, booking.venueName)}
              activeOpacity={0.7}
              disabled={cancellingId === booking.id}
            >
              {cancellingId === booking.id ? (
                <ActivityIndicator size="small" color="#EF4444" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="close-circle-outline"
                    size={18}
                    color="#EF4444"
                  />
                  <Text style={styles.cancelText}>Cancel</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={theme.gradients.header}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Bookings</Text>
            <Text style={styles.headerSubtitle}>
              {activeBookings.length} active  •  {pastBookings.length} past
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >
        {/* Active Bookings */}
        {activeBookings.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="calendar-check"
                size={20}
                color={theme.colors.text}
              />
              <Text style={styles.sectionTitle}>Active Bookings</Text>
            </View>
            {activeBookings.map((booking) => renderBookingCard(booking))}
          </View>
        ) : (
          renderEmptyState('No active bookings yet. Book your first turf!')
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="history"
                size={20}
                color={theme.colors.text}
              />
              <Text style={styles.sectionTitle}>Past Bookings</Text>
            </View>
            {pastBookings.map((booking) => renderBookingCard(booking, true))}
          </View>
        )}

        {/* Empty State */}
        {activeBookings.length === 0 && pastBookings.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <MaterialCommunityIcons
                name="calendar-blank-outline"
                size={64}
                color={theme.colors.textLight}
              />
            </View>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyText}>
              Start exploring amazing turfs and make your first booking!
            </Text>
            <TouchableOpacity style={styles.exploreButton} activeOpacity={0.8}>
              <Text style={styles.exploreButtonText}>Explore Turfs</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={18}
                color={theme.colors.secondary}
              />
            </TouchableOpacity>
          </View>
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
  headerGradient: {
    paddingBottom: theme.spacing.lg,
  },
  header: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.base,
  },
  headerTitle: {
    fontSize: theme.fontSizes['3xl'],
    fontFamily: theme.fonts.bold,
    color: theme.colors.secondary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
    opacity: 0.8,
  },
  scrollContent: {
    padding: theme.spacing.base,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.text,
  },
  bookingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  cardImageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.border,
  },
  cardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  statusBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  cancelledStatusBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusText: {
    fontSize: 11,
    fontFamily: theme.fonts.semiBold,
    color: '#10B981',
  },
  cancelledStatusText: {
    fontSize: 11,
    fontFamily: theme.fonts.semiBold,
    color: '#EF4444',
  },
  cardContent: {
    padding: theme.spacing.base,
  },
  venueName: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  priceContainer: {
    gap: 2,
  },
  priceLabel: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },
  price: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  cancelText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.semiBold,
    color: '#EF4444',
  },
  rebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  rebookText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.base,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  emptyTitle: {
    fontSize: theme.fontSizes['2xl'],
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 24,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
  },
  exploreButtonText: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.secondary,
  },
});
