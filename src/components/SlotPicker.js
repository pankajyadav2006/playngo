import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../theme/theme';

const timeSlotCategories = [
    { id: 'morning', label: 'Morning', icon: 'weather-sunset-up', time: '06:00 - 12:00' },
    { id: 'afternoon', label: 'Afternoon', icon: 'weather-sunny', time: '12:00 - 18:00' },
    { id: 'night', label: 'Night', icon: 'weather-night', time: '18:00 - 24:00' },
];

const SlotPicker = ({
    selectedCategory,
    onSelectCategory,
    availableSlots = [],
    selectedSlot,
    onSelectSlot,
    bookedSlots = [],
}) => {
    const isSlotBooked = (slot) => bookedSlots.includes(slot);
    const isSlotAvailable = (slot) => availableSlots.includes(slot);

    return (
        <View style={styles.container}>
            {/* Time Category Selector */}
            <View style={styles.categoryContainer}>
                {timeSlotCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryButton,
                            selectedCategory === category.id && styles.categoryButtonSelected,
                        ]}
                        onPress={() => onSelectCategory(category.id)}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons
                            name={category.icon}
                            size={20}
                            color={
                                selectedCategory === category.id
                                    ? theme.colors.secondary
                                    : theme.colors.text
                            }
                        />
                        <Text
                            style={[
                                styles.categoryLabel,
                                selectedCategory === category.id && styles.categoryLabelSelected,
                            ]}
                        >
                            {category.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Available Time Slots */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.slotsContainer}
            >
                {availableSlots.map((slot) => {
                    const booked = isSlotBooked(slot);
                    const selected = selectedSlot === slot;

                    return (
                        <TouchableOpacity
                            key={slot}
                            style={[
                                styles.slotButton,
                                booked && styles.slotBooked,
                                selected && styles.slotSelected,
                            ]}
                            onPress={() => !booked && onSelectSlot(slot)}
                            disabled={booked}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.slotTime,
                                    booked && styles.slotTimeBooked,
                                    selected && styles.slotTimeSelected,
                                ]}
                            >
                                {slot}
                            </Text>
                            {selected && (
                                <View style={styles.slotDuration}>
                                    <Text style={styles.slotDurationText}>90 min</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: theme.spacing.base,
    },
    categoryContainer: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.base,
    },
    categoryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.xs,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    categoryButtonSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    categoryLabel: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.medium,
        color: theme.colors.text,
    },
    categoryLabelSelected: {
        color: theme.colors.secondary,
    },
    slotsContainer: {
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
    },
    slotButton: {
        minWidth: 100,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.base,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        alignItems: 'center',
    },
    slotSelected: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    slotBooked: {
        backgroundColor: theme.colors.divider,
        borderColor: theme.colors.border,
        opacity: 0.5,
    },
    slotTime: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.text,
    },
    slotTimeSelected: {
        color: theme.colors.secondary,
    },
    slotTimeBooked: {
        color: theme.colors.textLight,
        textDecorationLine: 'line-through',
    },
    slotDuration: {
        marginTop: 4,
    },
    slotDurationText: {
        fontSize: theme.fontSizes.xs,
        fontFamily: theme.fonts.regular,
        color: theme.colors.secondary,
    },
});

export default SlotPicker;
