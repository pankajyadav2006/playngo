import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import theme from '../theme/theme';
import SlotPicker from '../components/SlotPicker';
import CustomButton from '../components/CustomButton';

export default function BookingScreen({ route, navigation }) {
    const { venue } = route.params;
    const { addBooking } = useApp();
    const { refreshUser } = useAuth();

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('morning');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isBooking, setIsBooking] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const selectionScale = useRef(new Animated.Value(0.9)).current;
    const selectionOpacity = useRef(new Animated.Value(0)).current;

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        // Entrance animations
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: theme.animation.timing.slow,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: theme.animation.timing.slow,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    useEffect(() => {
        // Selection info animation
        if (selectedDate && selectedSlot) {
            Animated.parallel([
                Animated.spring(selectionScale, {
                    toValue: 1,
                    ...theme.animation.spring.bouncy,
                    useNativeDriver: true,
                }),
                Animated.timing(selectionOpacity, {
                    toValue: 1,
                    duration: theme.animation.timing.normal,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [selectedDate, selectedSlot]);

    const generateTimeSlots = () => {
        const slots = [];
        const startHour = 6;
        const endHour = 22;

        for (let hour = startHour; hour <= endHour; hour++) {
            const startTime = hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
            const endTime = hour + 1 < 12 ? `${hour + 1}:00 AM` : hour + 1 === 12 ? '12:00 PM' : `${hour + 1 - 12}:00 PM`;
            slots.push(`${startTime} - ${endTime}`);
        }

        return slots;
    };

    const filterSlotsByCategory = (slots, category) => {
        if (category === 'morning') {
            return slots.filter(slot => slot.includes('AM') && !slot.startsWith('12:'));
        } else if (category === 'afternoon') {
            return slots.filter(slot => slot.startsWith('12:') || (slot.includes('PM') && (parseInt(slot) < 6)));
        } else {
            return slots.filter(slot => slot.includes('PM') && parseInt(slot) >= 6);
        }
    };

    const handleDateSelect = (day) => {
        setSelectedDate(day.dateString);
        setSelectedSlot(null);
    };

    const allSlots = generateTimeSlots();
    const availableSlots = selectedDate ? filterSlotsByCategory(allSlots, selectedCategory) : [];

    const handleConfirmBooking = async () => {
        console.log('🎯 Confirm Booking clicked!');
        console.log('📅 Selected date:', selectedDate);
        console.log('⏰ Selected slot:', selectedSlot);

        if (!selectedDate || !selectedSlot) {
            Alert.alert('Missing Information', 'Please select both date and time');
            return;
        }

        const bookingData = {
            venueId: venue.id,
            venueName: venue.name,
            venueImage: venue.image,
            date: selectedDate,
            time: selectedSlot,
            duration: venue.priceUnit,
            price: venue.price,
        };

        setIsBooking(true);
        const result = await addBooking(bookingData);
        setIsBooking(false);

        if (result.success) {
            await refreshUser();

            Alert.alert(
                'Success! 🎉',
                result.message || 'Booking confirmed successfully. You earned 10 reward points!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.goBack();
                            navigation.goBack();
                        },
                    },
                ]
            );
        } else {
            Alert.alert('Booking Failed', result.error || 'Failed to create booking');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
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
                <Text style={styles.headerTitle}>Book Your Slot</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Calendar */}
                <Animated.View
                    style={[
                        styles.section,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <Calendar
                        minDate={today}
                        onDayPress={handleDateSelect}
                        markedDates={{
                            [selectedDate]: {
                                selected: true,
                                selectedColor: theme.colors.primaryAccent,
                            },
                        }}
                        theme={{
                            backgroundColor: theme.colors.surface,
                            calendarBackground: theme.colors.surface,
                            selectedDayBackgroundColor: theme.colors.primaryAccent,
                            selectedDayTextColor: theme.colors.surface,
                            todayTextColor: theme.colors.primaryAccent,
                            dayTextColor: theme.colors.text,
                            textDisabledColor: theme.colors.textLight,
                            monthTextColor: theme.colors.text,
                            textMonthFontFamily: theme.fonts.bold,
                            textDayFontFamily: theme.fonts.regular,
                            textDayHeaderFontFamily: theme.fonts.medium,
                            textMonthFontSize: 18,
                            textDayFontSize: 14,
                            arrowColor: theme.colors.primaryAccent,
                        }}
                    />
                </Animated.View>

                {/* Pick a Slot */}
                {selectedDate && (
                    <Animated.View
                        style={[
                            styles.section,
                            {
                                opacity: fadeAnim,
                            }
                        ]}
                    >
                        <Text style={styles.sectionTitle}>Pick a Slot</Text>
                        <SlotPicker
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                            availableSlots={availableSlots}
                            selectedSlot={selectedSlot}
                            onSelectSlot={setSelectedSlot}
                        />
                    </Animated.View>
                )}

                {/* Selected Info */}
                {selectedDate && selectedSlot && (
                    <Animated.View
                        style={[
                            styles.selectedInfo,
                            {
                                opacity: selectionOpacity,
                                transform: [{ scale: selectionScale }],
                            }
                        ]}
                    >
                        <LinearGradient
                            colors={['rgba(184, 255, 60, 0.1)', 'rgba(184, 255, 60, 0.02)']}
                            style={styles.selectedInfoGradient}
                        >
                            <Text style={styles.selectedInfoTitle}>Your Selection</Text>
                            <View style={styles.infoRow}>
                                <View style={styles.infoIconCircle}>
                                    <MaterialCommunityIcons
                                        name="calendar"
                                        size={18}
                                        color={theme.colors.primaryAccent}
                                    />
                                </View>
                                <Text style={styles.infoText}>{selectedDate}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <View style={styles.infoIconCircle}>
                                    <MaterialCommunityIcons
                                        name="clock-outline"
                                        size={18}
                                        color={theme.colors.primaryAccent}
                                    />
                                </View>
                                <Text style={styles.infoText}>{selectedSlot}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <View style={styles.infoIconCircle}>
                                    <MaterialCommunityIcons
                                        name="currency-inr"
                                        size={18}
                                        color={theme.colors.primaryAccent}
                                    />
                                </View>
                                <Text style={styles.infoTextPrice}>₹{venue.price.toLocaleString()}</Text>
                            </View>
                        </LinearGradient>
                    </Animated.View>
                )}
            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.bottomBar}>
                {/* Confirm Button */}
                <CustomButton
                    title={isBooking ? 'Booking...' : 'Confirm Booking'}
                    onPress={handleConfirmBooking}
                    disabled={!selectedDate || !selectedSlot || isBooking}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.sm,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
    },
    scrollContent: {
        paddingBottom: 120,
    },
    section: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.base,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    sectionTitle: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    selectedInfo: {
        marginHorizontal: theme.spacing.base,
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.primaryAccent + '30',
        ...theme.shadows.md,
    },
    selectedInfoGradient: {
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
    },
    selectedInfoTitle: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    infoIconCircle: {
        width: 36,
        height: 36,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.primaryAccent + '15',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.medium,
        color: theme.colors.text,
    },
    infoTextPrice: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.bold,
        color: theme.colors.primaryAccent,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.base,
        paddingBottom: theme.spacing.xl,
        ...theme.shadows.xl,
    },
});
