import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Alert,
    Image,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

const EnterOTP = ({ navigation, route }: any) => {

    const phoneNumber = route?.params?.phoneNumber || '';
    const countryCode = route?.params?.countryCode || '+91';

    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [loading, setLoading] = useState(false);

    const inputs = useRef<any[]>([]);

    useEffect(() => {
        setTimeout(() => {
            inputs.current[0]?.focus();
        }, 300);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 3) {
                inputs.current[index + 1].focus();
            }

            if (!value && index > 0) {
                inputs.current[index - 1].focus();
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins} : ${secs < 10 ? '0' : ''}${secs}`;
    };

    const goBack = () => {
        navigation.goBack();
    };

    // 🔥 RESEND OTP API
    const resendOtp = async () => {
        if (timer === 0) {
            try {
                setLoading(true);

                const res = await axios.post(
                    "http://192.168.1.10/send_otp.php",
                    {
                        mobile: phoneNumber,
                    }
                );

                if (res.data.status) {
                    setTimer(60);
                    setOtp(['', '', '', '']);
                    inputs.current[0]?.focus();
                    Alert.alert("Success", "OTP Resent Successfully!");
                } else {
                    Alert.alert("Error", "Failed to resend OTP");
                }

            } catch (error) {
                console.log("RESEND ERROR:", error);
                Alert.alert("Error", "Server issue");
            } finally {
                setLoading(false);
            }
        }
    };

    // 🔥 VERIFY OTP API
    const verifyOtp = async () => {
        const enteredOtp = otp.join('');

        if (enteredOtp.length !== 4) {
            Alert.alert("Error", "Enter complete 4 digit OTP");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                "http://192.168.1.10/verify_otp.php",
                {
                    mobile: phoneNumber,
                    otp: enteredOtp,
                }
            );

            if (res.data.status) {
                Alert.alert("Success", "OTP Verified Successfully ✅");
                navigation.replace("Home");
            } else {
                Alert.alert("Error", "Invalid OTP");
            }

        } catch (error) {
            console.log("VERIFY ERROR:", error);
            Alert.alert("Error", "Server issue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#ffffff', '#fff0f0', '#ffd6d6', '#ff8080', '#e62e2e', '#cc1f1f']}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

            <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Image
                    source={require('../../assets/back-arrow.png')}
                    style={styles.backIcon}
                />
            </TouchableOpacity>

            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logoImage}
                />
                <Text style={styles.appTitle}>Car Hauling</Text>
            </View>

            <View style={styles.imageContainer}>
                <Image
                    source={require('../../assets/delivery-man-phone-map.png')}
                    style={styles.headerImage}
                />
            </View>

            <View style={styles.textSection}>
                <Text style={styles.mainText}>Verify Phone Number</Text>
                <Text style={styles.subText}>Enter the 4 digit code sent to</Text>

                <View style={styles.phoneRow}>
                    <Text style={styles.phoneNumber}>{countryCode} {phoneNumber}</Text>
                    <TouchableOpacity onPress={goBack}>
                        <Image
                            source={require('../../assets/edit-icon.png')}
                            style={styles.editIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => { inputs.current[index] = ref; }}
                        value={digit}
                        onChangeText={(val) => handleChange(val, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        style={[
                            styles.otpBox,
                            digit ? styles.otpBoxFilled : {}
                        ]}
                    />
                ))}
            </View>

            <TouchableOpacity
                onPress={verifyOtp}
                disabled={loading}
                style={[styles.verifyButton, loading && styles.buttonDisabled]}
            >
                {loading ? (
                    <ActivityIndicator size="large" color="#cc1f1f" />
                ) : (
                    <Text style={styles.verifyButtonText}>Verify OTP</Text>
                )}
            </TouchableOpacity>

            <View style={styles.resendSection}>
                <Text style={styles.resendText}>Didn't receive the code?</Text>
                <TouchableOpacity onPress={resendOtp} disabled={timer > 0}>
                    <Text style={[
                        styles.resendTimer,
                        timer === 0 ? styles.resendActive : styles.resendDisabled
                    ]}>
                        {timer > 0 ? `Resend in ${formatTime(timer)}` : "RESEND OTP"}
                    </Text>
                </TouchableOpacity>
            </View>

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        marginTop: 10,
        padding: 8,
        width: 40,
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: '#333',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    logoImage: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    appTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#cc1f1f',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    headerImage: {
        width: 200,
        height: 150,
        resizeMode: 'contain',
    },
    textSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    mainText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    phoneNumber: {
        fontSize: 18,
        fontWeight: '600',
        color: '#cc1f1f',
    },
    editIcon: {
        width: 20,
        height: 20,
        tintColor: '#666',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 30,
        marginBottom: 30,
    },
    otpBox: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: 'white',
    },
    otpBoxFilled: {
        borderColor: '#cc1f1f',
        backgroundColor: '#fff5f5',
    },
    verifyButton: {
        backgroundColor: '#cc1f1f',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    buttonDisabled: {
        backgroundColor: '#999',
    },
    verifyButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resendSection: {
        alignItems: 'center',
        marginTop: 10,
    },
    resendText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    resendTimer: {
        fontSize: 16,
        fontWeight: '600',
    },
    resendActive: {
        color: '#cc1f1f',
    },
    resendDisabled: {
        color: '#999',
    },
});

export default EnterOTP;