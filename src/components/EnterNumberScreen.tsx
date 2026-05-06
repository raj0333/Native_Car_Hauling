import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal,
    FlatList,
    Alert
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";

interface EnterNumberScreenProps {
    onOtpSuccess: (mobileNumber: string, countryCode: string) => void;
}

const countryCodes = [
    { label: "USA", value: "+1", flag: "🇺🇸" },
    { label: "UK", value: "+44", flag: "🇬🇧" },
    { label: "Australia", value: "+61", flag: "🇦🇺" },
    { label: "Canada", value: "+1", flag: "🇨🇦" },
    { label: "Germany", value: "+49", flag: "🇩🇪" },
    { label: "France", value: "+33", flag: "🇫🇷" },
    { label: "UAE", value: "+971", flag: "🇦🇪" },
    { label: "Pakistan", value: "+92", flag: "🇵🇰" },
    { label: "India", value: "+91", flag: "🇮🇳" },
];

export default function EnterNumberScreen({ onOtpSuccess }: EnterNumberScreenProps) {
    const [mobile, setMobile] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[8]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);

    const filteredCountries = countryCodes.filter(country =>
        country.label.toLowerCase().includes(searchText.toLowerCase()) ||
        country.value.includes(searchText)
    );

    const handleSendOtp = async () => {
        if (mobile.length !== 10) {
            Alert.alert("Error", "Enter valid mobile number");
            return;
        }

        // 🔥 DEBUG LOGS (VERY IMPORTANT)
        console.log("📱 Sending number:", mobile);
        console.log("🌐 API URL:", "http://192.168.1.10/send_otp.php");

        try {
            setLoading(true);

            const res = await axios.post(
                "http://192.168.1.10/send_otp.php",
                {
                    mobile: mobile,
                }
            );

            // 🔥 RESPONSE LOG
            console.log("✅ API Response:", res.data);

            if (res.data.status) {
                console.log("🎯 OTP Sent Successfully");

                // 👉 OTP SCREEN OPEN
                onOtpSuccess(mobile, selectedCountry.value);

            } else {
                console.log("❌ API Failed Response");
                Alert.alert("Error", "Failed to send OTP");
            }

        } catch (error) {
            console.log("❌ ERROR:", error);
            Alert.alert("Error", "Server not responding");
        } finally {
            setLoading(false);
        }
    };
    return (
        <LinearGradient
            colors={['#ffffff', '#ff6a6a', '#E21B14']}
            locations={[0, 0.8, 1]}
            style={styles.container}
        >
            <View style={styles.logoBox}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logoImg}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.title}>Car Hauling</Text>

            <Image
                source={require("../../assets/delivery-man-phone-map.png")}
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={styles.heading}>Let’s Get Started</Text>
            <Text style={styles.subText}>
                Access our services with a valid Phone number
            </Text>

            <View style={styles.inputRow}>
                <TouchableOpacity
                    style={styles.countryBox}
                    onPress={() => setShowDropdown(true)}
                    activeOpacity={0.7}
                >
                    <Text style={{ fontSize: 20 }}>{selectedCountry.flag}</Text>
                    <Text style={styles.code}>{selectedCountry.value}</Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>

                <TextInput
                    style={styles.input}
                    placeholder="2345678890"
                    placeholderTextColor="#FF5B56"
                    keyboardType="numeric"
                    value={mobile}
                    onChangeText={setMobile}
                    maxLength={10}
                />
            </View>

            {/* Modal */}
            <Modal
                visible={showDropdown}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDropdown(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowDropdown(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country</Text>
                            <TouchableOpacity onPress={() => setShowDropdown(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search country or code..."
                            value={searchText}
                            onChangeText={setSearchText}
                        />

                        <FlatList
                            data={filteredCountries}
                            keyExtractor={(item) => item.value + item.label}
                            style={styles.countryList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.countryItem,
                                        selectedCountry.value === item.value &&
                                        selectedCountry.label === item.label &&
                                        styles.selectedCountry
                                    ]}
                                    onPress={() => {
                                        setSelectedCountry(item);
                                        setShowDropdown(false);
                                        setSearchText("");
                                    }}
                                >
                                    <Text style={styles.countryFlag}>{item.flag}</Text>
                                    <Text style={styles.countryName}>{item.label}</Text>
                                    <Text style={styles.countryCode}>{item.value}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={handleSendOtp}
                disabled={loading}
                activeOpacity={0.8}
            >
                <Text style={styles.btnText}>
                    {loading ? "Sending..." : "Continue"}
                </Text>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
    },
    logoBox: {
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    logoImg: {
        width: 200,
        height: 150,
    },
    title: {
        fontSize: 54,
        color: "red",
        fontWeight: "bold",
        marginBottom: 20,
    },
    image: {
        width: 450,
        height: 250,
        marginBottom: 20,
    },
    heading: {
        fontSize: 40,
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 10,
    },
    subText: {
        color: "#000",
        fontSize: 19,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: 'center',
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
    },
    countryBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginRight: 10,
        height: 48,
    },
    code: {
        marginLeft: 8,
        fontWeight: "bold",
        fontSize: 16,
    },
    dropdownArrow: {
        marginLeft: 8,
        fontSize: 12,
        color: '#666',
    },
    input: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 10,
        width: 180,
        fontSize: 19,
        fontWeight: 'bold',
        height: 48,
    },
    button: {
        backgroundColor: "#fff",
        paddingVertical: 14,
        paddingHorizontal: 80,
        borderRadius: 30,
        marginTop: 10,
    },
    btnText: {
        color: "#D9201B",
        fontSize: 24,
        fontWeight: "bold",
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        width: '90%',
        maxHeight: '75%',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        paddingBottom: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        fontSize: 22,
        color: '#666',
        padding: 4,
    },
    searchInput: {
        margin: 16,
        marginTop: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        fontSize: 15,
        backgroundColor: '#f9f9f9',
    },
    countryList: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        borderRadius: 8,
        marginVertical: 6,
    },
    selectedCountry: {
        backgroundColor: '#fff5f5',
        borderWidth: 2,
        borderColor: '#cc1f1f',
        marginVertical: 6,
    },
    countryFlag: {
        fontSize: 22,
        marginRight: 12,
    },
    countryName: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    countryCode: {
        fontSize: 15,
        color: '#666',
        fontWeight: '500',
    },
});
