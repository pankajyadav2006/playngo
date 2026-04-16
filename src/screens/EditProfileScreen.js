import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import theme from '../theme/theme';
import CustomButton from '../components/CustomButton';

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        avatar: user?.avatar || null,
    });

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to update your profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            // Convert base64 to data URI so it works across devices
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            console.log('📸 Image selected - Base64 length:', result.assets[0].base64?.length);
            console.log('📸 Data URI preview:', base64Image.substring(0, 100) + '...');
            setFormData(prev => ({ ...prev, avatar: base64Image }));
        }
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            Alert.alert('Error', 'Name is required');
            return;
        }

        try {
            setLoading(true);

            // Clean up data before sending
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                avatar: formData.avatar,
            };

            console.log('💾 Saving profile with avatar length:', updateData.avatar?.length);
            console.log('💾 Avatar preview:', updateData.avatar?.substring(0, 50) + '...');

            await authAPI.updateProfile(updateData);
            await refreshUser();

            Alert.alert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
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
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                {/* Profile Picture */}
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                        <Image
                            source={{
                                uri: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=B8FF3C&color=1A1D29`
                            }}
                            style={styles.avatar}
                        />
                        <View style={styles.editIconContainer}>
                            <MaterialCommunityIcons name="camera" size={20} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                </View>

                {/* Form Fields */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                            placeholder="Enter your name"
                            placeholderTextColor={theme.colors.textLight}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.phone}
                            onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                            placeholder="Enter phone number"
                            placeholderTextColor={theme.colors.textLight}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <CustomButton
                        title="Save Changes"
                        onPress={handleSave}
                        loading={loading}
                    />
                </View>
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
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.text,
    },
    content: {
        flex: 1,
        padding: theme.spacing.lg,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: theme.colors.surface,
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.background,
    },
    changePhotoText: {
        marginTop: theme.spacing.sm,
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.primaryAccent,
    },
    form: {
        gap: theme.spacing.lg,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.medium,
        color: theme.colors.text,
    },
    input: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.base,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 2,
        borderColor: theme.colors.border,
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.regular,
        color: theme.colors.text,
    },
    footer: {
        marginTop: theme.spacing.xl,
    },
});
