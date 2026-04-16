import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { sportsCategories } from '../data/sportsCategories';
import theme from '../theme/theme';
import SearchBar from '../components/SearchBar';
import SportCategoryCard from '../components/SportCategoryCard';
import VenueCard from '../components/VenueCard';

export default function HomeScreen() {
  const navigation = useNavigation();
  const {
    getFilteredVenues,
    toggleFavorite,
    isFavorite,
    loadVenues,
    state,
    setSearchQuery,
    setSelectedSport,
  } = useApp();

  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;
  const contentSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.animation.timing.slow,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: theme.animation.timing.normal,
        useNativeDriver: true,
      }),
      Animated.timing(contentSlide, {
        toValue: 0,
        duration: theme.animation.timing.slow,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadVenues();
    setRefreshing(false);
  }, [loadVenues]);

  const filteredVenues = getFilteredVenues();

  console.log(' HomeScreen - Total venues in state:', state.venues?.length);
  console.log(' HomeScreen - Filtered venues:', filteredVenues.length);
  console.log(' HomeScreen - Selected sport:', state.selectedSport);
  console.log(' HomeScreen - Search query:', state.searchQuery);

  const handleSportPress = (sportName) => {
    if (state.selectedSport === sportName) {
      setSelectedSport(null);
    } else {
      setSelectedSport(sportName);
    }
  };

  const handleVenuePress = (venue) => {
    navigation.navigate('TurfDetails', { venue });
  };

  return (
    <View style={styles.container}>
      {/* Header with Enhanced Gradient */}
      <LinearGradient
        colors={theme.gradients.header}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={['top']}>
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: headerSlide }],
              }
            ]}
          >
            <View>
              <Text style={styles.greeting}>Hello !</Text>
              <Text style={styles.headerTitle}>Find Your Perfect Turf</Text>
            </View>
          </Animated.View>

          {/* Search Bar */}
          <Animated.View
            style={[
              styles.searchSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: headerSlide }],
              }
            ]}
          >
            <SearchBar
              value={state.searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search turfs, locations..."
            />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primaryAccent}
            colors={[theme.colors.primaryAccent]}
          />
        }
      >
        {/* Sport Categories */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: contentSlide }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sport Categories</Text>
            {state.selectedSport && (
              <TouchableOpacity onPress={() => setSelectedSport(null)}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {sportsCategories.map((sport) => (
              <SportCategoryCard
                key={sport.id}
                sport={sport}
                isSelected={state.selectedSport === sport.name}
                onPress={() => handleSportPress(sport.name)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Turfs Near You */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: contentSlide }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {state.selectedSport ? `${state.selectedSport} Venues` : 'Venues Near You'}
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filteredVenues.length} found</Text>
            </View>
          </View>

          {filteredVenues.length > 0 ? (
            filteredVenues.map((venue, index) => (
              <Animated.View
                key={venue.id}
                style={{
                  opacity: fadeAnim,
                  transform: [{
                    translateY: contentSlide.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 30 + (index * 10)],
                    }),
                  }],
                }}
              >
                <VenueCard
                  venue={venue}
                  onPress={() => handleVenuePress(venue)}
                  isFavorite={isFavorite(venue.id)}
                  onToggleFavorite={() => toggleFavorite(venue.id)}
                />
              </Animated.View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Text style={styles.emptyIcon}>🔍</Text>
              </View>
              <Text style={styles.emptyTitle}>No venues found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your filters or search query
              </Text>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSelectedSport(null);
                  setSearchQuery('');
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={theme.gradients.button}
                  style={styles.clearButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.clearButtonText}>Clear All Filters</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
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
    paddingBottom: theme.spacing.xl,
  },
  header: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.base,
  },
  greeting: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.medium,
    color: theme.colors.secondary,
    marginBottom: 4,
    opacity: 0.9,
  },
  headerTitle: {
    fontSize: theme.fontSizes['3xl'],
    fontFamily: theme.fonts.bold,
    color: theme.colors.secondary,
    letterSpacing: -0.5,
  },
  searchSection: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.lg,
  },
  scrollContent: {
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing['4xl'],
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
  },
  countBadge: {
    backgroundColor: theme.colors.secondaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  countText: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.surface,
  },
  clearText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primaryAccent,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.base,
    gap: theme.spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: theme.fontSizes.xl,
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
    lineHeight: 22,
  },
  clearButton: {
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  clearButtonGradient: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  clearButtonText: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.secondary,
  },
});
