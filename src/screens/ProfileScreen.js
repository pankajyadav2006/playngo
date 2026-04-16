import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import theme from '../theme/theme';

export default function ProfileScreen() {
    const navigation = useNavigation();
    const { user: authUser, logout } = useAuth();
    const { state } = useApp();
    const user = authUser || state.user;

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const profileSlide = useRef(new Animated.Value(-30)).current;
    const statsScale = useRef(new Animated.Value(0.8)).current;
    const menuSlide = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: theme.animation.timing.slow,
                useNativeDriver: true,
            }),
            Animated.timing(profileSlide, {
                toValue: 0,
                duration: theme.animation.timing.normal,
                useNativeDriver: true,
            }),
            Animated.spring(statsScale, {
                toValue: 1,
                delay: 200,
                ...theme.animation.spring.bouncy,
                useNativeDriver: true,
            }),
            Animated.timing(menuSlide, {
                toValue: 0,
                duration: theme.animation.timing.slow,
                delay: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => logout()
                },
            ]
        );
    };

    const menuItems = [
        {
            id: '1',
            icon: 'account-edit-outline',
            label: 'Edit Profile',
            color: theme.colors.text,
            onPress: () => navigation.navigate('EditProfile'),
        },
        {
            id: '2',
            icon: 'heart-outline',
            label: 'My Favorites',
            count: state.favorites.length,
            color: theme.colors.text,
            onPress: () => { },
        },
        {
            id: '3',
            icon: 'help-circle-outline',
            label: 'Help & Support',
            color: theme.colors.text,
            onPress: () => { },
        },
        {
            id: '4',
            icon: 'logout',
            label: 'Logout',
            color: theme.colors.error,
            onPress: handleLogout,
        },
    ];

    const MenuItemComponent = ({ item, index, isLast }) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;

        const handlePressIn = () => {
            Animated.spring(scaleAnim, {
                toValue: 0.98,
                ...theme.animation.spring.snappy,
                useNativeDriver: true,
            }).start();
        };

        const handlePressOut = () => {
            Animated.spring(scaleAnim, {
                toValue: 1,
                ...theme.animation.spring.bouncy,
                useNativeDriver: true,
            }).start();
        };

        return (
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                    style={[styles.menuItem, isLast && styles.menuItemLast]}
                    onPress={item.onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    activeOpacity={0.9}
                >
                    <View style={styles.menuLeft}>
                        <View
                            style={[
                                styles.menuIconCircle,
                                item.color === theme.colors.error && styles.menuIconCircleError,
                            ]}
                        >
                            <MaterialCommunityIcons
                                name={item.icon}
                                size={20}
                                color={item.color}
                            />
                        </View>
                        <Text style={[styles.menuLabel, { color: item.color }]}>
                            {item.label}
                        </Text>
                    </View>
                    <View style={styles.menuRight}>
                        {item.count !== undefined && (
                            <LinearGradient
                                colors={theme.gradients.button}
                                style={styles.badge}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.badgeText}>{item.count}</Text>
                            </LinearGradient>
                        )}
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={20}
                            color={theme.colors.textLight}
                        />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
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
                            }
                        ]}
                    >
                        <Text style={styles.headerTitle}>Profile</Text>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => navigation.navigate('EditProfile')}
                        >
                            <MaterialCommunityIcons
                                name="pencil-outline"
                                size={20}
                                color={theme.colors.secondary}
                            />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Profile Info */}
                    <Animated.View
                        style={[
                            styles.profileSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: profileSlide }],
                            }
                        ]}
                    >
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                            <View style={styles.verifiedBadge}>
                                <MaterialCommunityIcons
                                    name="check-decagram"
                                    size={20}
                                    color={theme.colors.primaryAccent}
                                />
                            </View>
                        </View>
                        <Text style={styles.name}>{user.name}</Text>
                        <Text style={styles.email}>{user.email}</Text>
                    </Animated.View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Stats */}
                <Animated.View
                    style={[
                        styles.statsContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: statsScale }],
                        }
                    ]}
                >
                    <View style={styles.statCard}>
                        <LinearGradient
                            colors={['rgba(184, 255, 60, 0.15)', 'rgba(184, 255, 60, 0.05)']}
                            style={styles.statIconCircle}
                        >
                            <MaterialCommunityIcons
                                name="calendar-check"
                                size={24}
                                color={theme.colors.primaryAccent}
                            />
                        </LinearGradient>
                        <Text style={styles.statValue}>{user.totalBookings || 0}</Text>
                        <Text style={styles.statLabel}>Bookings</Text>
                    </View>
                    <View style={styles.statCard}>
                        <LinearGradient
                            colors={['rgba(255, 184, 0, 0.15)', 'rgba(255, 184, 0, 0.05)']}
                            style={styles.statIconCircle}
                        >
                            <MaterialCommunityIcons
                                name="trophy"
                                size={24}
                                color="#D49A00"
                            />
                        </LinearGradient>
                        <Text style={styles.statValue}>{user.rewardPoints || 0}</Text>
                        <Text style={styles.statLabel}>Rewards</Text>
                    </View>
                </Animated.View>

                {/* Menu Items */}
                <Animated.View
                    style={[
                        styles.menuContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: menuSlide }],
                        }
                    ]}
                >
                    <Text style={styles.menuSectionTitle}>Account</Text>
                    {menuItems.map((item, index) => (
                        <MenuItemComponent
                            key={item.id}
                            item={item}
                            index={index}
                            isLast={index === menuItems.length - 1}
                        />
                    ))}
                </Animated.View>

                {/* App Version */}
                <Text style={styles.version}>PlayNxt v1.0.0</Text>
                <Text style={styles.copyright}>© 2025 PlayNxt. All rights reserved.</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textSecondary,
    },
    headerGradient: {
        paddingBottom: theme.spacing['2xl'],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.base,
        marginBottom: theme.spacing.lg,
    },
    headerTitle: {
        fontSize: theme.fontSizes['2xl'],
        fontFamily: theme.fonts.bold,
        color: theme.colors.secondary,
    },
    editButton: {
        width: 44,
        height: 44,
        borderRadius: theme.borderRadius.md,
        backgroundColor: 'rgba(26, 29, 41, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: theme.spacing.base,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: theme.spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.surface,
        borderWidth: 4,
        borderColor: theme.colors.secondary,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.full,
        padding: 2,
        ...theme.shadows.sm,
    },
    name: {
        fontSize: theme.fontSizes['2xl'],
        fontFamily: theme.fonts.bold,
        color: theme.colors.secondary,
        marginBottom: 4,
    },
    email: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.regular,
        color: theme.colors.secondary,
        opacity: 0.85,
    },
    scrollContent: {
        paddingBottom: theme.spacing['3xl'],
    },
    statsContainer: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        paddingHorizontal: theme.spacing.base,
        marginTop: theme.spacing.base,
        marginBottom: theme.spacing.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        alignItems: 'center',
        ...theme.shadows.md,
    },
    statIconCircle: {
        width: 52,
        height: 52,
        borderRadius: theme.borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.md,
    },
    statValue: {
        fontSize: theme.fontSizes['2xl'],
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: theme.fontSizes.xs,
        fontFamily: theme.fonts.medium,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuContainer: {
        backgroundColor: theme.colors.surface,
        marginHorizontal: theme.spacing.base,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.md,
        ...theme.shadows.md,
    },
    menuSectionTitle: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.textSecondary,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginBottom: 4,
    },
    menuItemLast: {
        marginBottom: 0,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    menuIconCircle: {
        width: 44,
        height: 44,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIconCircleError: {
        backgroundColor: theme.colors.error + '15',
    },
    menuLabel: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.medium,
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    badge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
        minWidth: 26,
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 11,
        fontFamily: theme.fonts.bold,
        color: theme.colors.secondary,
    },
    version: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.medium,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginTop: theme.spacing['2xl'],
    },
    copyright: {
        fontSize: theme.fontSizes.xs,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginTop: theme.spacing.xs,
    },
});
