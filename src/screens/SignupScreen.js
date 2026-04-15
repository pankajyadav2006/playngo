import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import theme from '../theme/theme';

export default function SignupScreen({ navigation }) {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('USER');
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const roleScale = useRef(new Animated.Value(1)).current;

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

    const animateRoleChange = () => {
        Animated.sequence([
            Animated.timing(roleScale, {
                toValue: 0.95,
                duration: theme.animation.timing.fast,
                useNativeDriver: true,
            }),
            Animated.spring(roleScale, {
                toValue: 1,
                ...theme.animation.spring.bouncy,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setIsLoading(true);
        const result = await register({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim() || undefined,
            password,
            role,
        });
        setIsLoading(false);

        if (result.success) {
            Alert.alert(
                'Welcome!🎉',
                `Account created successfully! You're now logged in as ${role === 'PROVIDER' ? 'a Turf Owner' : 'a Customer'}.`,
                [{ text: 'Get Started', onPress: () => { } }]
            );
        } else {
            Alert.alert('Signup Failed', result.error);
        }
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
        animateRoleChange();
    };

    const getInputStyle = (fieldName) => [
        styles.inputContainer,
        focusedField === fieldName && styles.inputContainerFocused
    ];

    return (
        <View style={styles.container}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={theme.gradients.header}
                style={styles.headerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <MaterialCommunityIcons
                                name="arrow-left"
                                size={24}
                                color={theme.colors.secondary}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Create Account</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View
                        style={[
                            styles.formContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            }
                        ]}
                    >
                        <Text style={styles.subtitle}>
                            Sign up to start booking amazing turfs
                        </Text>

                        {/* Role Selection */}
                        <View style={styles.roleContainer}>
                            <Text style={styles.roleLabel}>I am a:</Text>
                            <Animated.View
                                style={[
                                    styles.roleButtons,
                                    { transform: [{ scale: roleScale }] }
                                ]}
                            >
                                <TouchableOpacity
                                    style={[styles.roleButton, role === 'USER' && styles.roleButtonActive]}
                                    onPress={() => handleRoleChange('USER')}
                                    activeOpacity={0.7}
                                >
                                    <MaterialCommunityIcons
                                        name="account"
                                        size={20}
                                        color={role === 'USER' ? theme.colors.secondary : theme.colors.textSecondary}
                                    />
                                    <Text style={[styles.roleButtonText, role === 'USER' && styles.roleButtonTextActive]}>
                                        Customer
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.roleButton, role === 'PROVIDER' && styles.roleButtonActive]}
                                    onPress={() => handleRoleChange('PROVIDER')}
                                    activeOpacity={0.7}
                                >
                                    <MaterialCommunityIcons
                                        name="store"
                                        size={20}
                                        color={role === 'PROVIDER' ? theme.colors.secondary : theme.colors.textSecondary}
                                    />
                                    <Text style={[styles.roleButtonText, role === 'PROVIDER' && styles.roleButtonTextActive]}>
                                        Turf Owner
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </View>

                        {/* Name Input */}
                        <View style={getInputStyle('name')}>
                            <MaterialCommunityIcons
                                name="account-outline"
                                size={20}
                                color={focusedField === 'name' ? theme.colors.primaryAccent : theme.colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name *"
                                placeholderTextColor={theme.colors.textLight}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Email Input */}
                        <View style={getInputStyle('email')}>
                            <MaterialCommunityIcons
                                name="email-outline"
                                size={20}
                                color={focusedField === 'email' ? theme.colors.primaryAccent : theme.colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email *"
                                placeholderTextColor={theme.colors.textLight}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Phone Input */}
                        <View style={getInputStyle('phone')}>
                            <MaterialCommunityIcons
                                name="phone-outline"
                                size={20}
                                color={focusedField === 'phone' ? theme.colors.primaryAccent : theme.colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone (Optional)"
                                placeholderTextColor={theme.colors.textLight}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                                onFocus={() => setFocusedField('phone')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={getInputStyle('password')}>
                            <MaterialCommunityIcons
                                name="lock-outline"
                                size={20}
                                color={focusedField === 'password' ? theme.colors.primaryAccent : theme.colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Password *"
                                placeholderTextColor={theme.colors.textLight}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <MaterialCommunityIcons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color={theme.colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={getInputStyle('confirmPassword')}>
                            <MaterialCommunityIcons
                                name="lock-check-outline"
                                size={20}
                                color={focusedField === 'confirmPassword' ? theme.colors.primaryAccent : theme.colors.textSecondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm Password *"
                                placeholderTextColor={theme.colors.textLight}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                onFocus={() => setFocusedField('confirmPassword')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        {/* Password hint */}
                        <Text style={styles.hint}>Password must be at least 6 characters</Text>

                        {/* Signup Button */}
                        <TouchableOpacity
                            style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                            onPress={handleSignup}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={theme.gradients.button}
                                style={styles.signupButtonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color={theme.colors.secondary} />
                                ) : (
                                    <>
                                        <Text style={styles.signupButtonText}>Create Account</Text>
                                        <MaterialCommunityIcons
                                            name="arrow-right"
                                            size={20}
                                            color={theme.colors.secondary}
                                        />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.sm,
        gap: theme.spacing.md,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: theme.borderRadius.md,
        backgroundColor: 'rgba(26, 29, 41, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: theme.fontSizes['2xl'],
        fontFamily: theme.fonts.bold,
        color: theme.colors.secondary,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
    },
    subtitle: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xl,
        lineHeight: 24,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.base,
        paddingHorizontal: theme.spacing.base,
        borderWidth: 2,
        borderColor: 'transparent',
        ...theme.shadows.sm,
    },
    inputContainerFocused: {
        borderColor: theme.colors.primaryAccent,
        ...theme.shadows.md,
    },
    inputIcon: {
        marginRight: theme.spacing.md,
    },
    input: {
        flex: 1,
        height: 56,
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.regular,
        color: theme.colors.text,
    },
    eyeIcon: {
        padding: theme.spacing.sm,
    },
    hint: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textLight,
        marginBottom: theme.spacing.xl,
        marginTop: -theme.spacing.sm,
    },
    signupButton: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: theme.spacing.xl,
        ...theme.shadows.lg,
    },
    signupButtonDisabled: {
        opacity: 0.6,
    },
    signupButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        gap: theme.spacing.sm,
    },
    signupButtonText: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.secondary,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.xl,
    },
    loginText: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textSecondary,
    },
    loginLink: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.primaryAccent,
    },
    roleContainer: {
        marginBottom: theme.spacing.xl,
    },
    roleLabel: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    roleButtons: {
        flexDirection: 'row',
        gap: theme.spacing.md,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        paddingVertical: theme.spacing.base,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    roleButtonActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        ...theme.shadows.md,
    },
    roleButtonText: {
        fontSize: theme.fontSizes.base,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.textSecondary,
    },
    roleButtonTextActive: {
        color: theme.colors.secondary,
    },
});
