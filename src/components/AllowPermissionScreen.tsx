import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import EnterNumberScreen from './EnterNumberScreen';

const { width } = Dimensions.get('window');

export default function AllowPermissionScreen({ onAllow = () => { } }: any) {

  const [showEnterNumber, setShowEnterNumber] = useState(false);

  const handleAllowClick = () => {
    console.log("✅ ALLOW BUTTON CLICKED - SHOWING ENTER NUMBER SCREEN");
    setShowEnterNumber(true);
    if (onAllow) {
      onAllow();
    }
  };

  // DIRECTLY SHOW ENTER NUMBER SCREEN AFTER BUTTON CLICK
  if (showEnterNumber) {
    return <EnterNumberScreen onOtpSuccess={() => { }} />;
  }

  return (
    <LinearGradient
      colors={['#ffffff', '#ff6a6a', '#E21B14']}
      locations={[0, 0.8, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Car Hauling</Text>
        </View>

        {/* Car Image */}
        <View style={styles.carContainer}>
          <Image
            source={require('../../assets/car.png')}
            style={styles.carImage}
          />
        </View>

        {/* Overlay */}
        <View style={styles.modalOverlay} />

        {/* Modal */}
        <View style={styles.modalContainer}>

          <Text style={styles.modalText}>
            Allow Car Hauling to send you Notifications..?
          </Text>

          <View style={styles.separator} />

          {/* ✅ ALLOW BUTTON */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleAllowClick}
          >
            <Text style={styles.allowText}>Allow</Text>
          </TouchableOpacity>

          {/* DON'T ALLOW */}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.dontAllowText}>Don't Allow</Text>
          </TouchableOpacity>

        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'space-between' },

  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 54,
    fontWeight: '900',
    color: '#d91c1c',
  },

  carContainer: {
    alignItems: 'center',
    flex: 1,
  },
  carImage: {
    width: width * 0.98,
    height: 320,
  },

  modalOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.45)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 32,
    marginBottom: 50,
    padding: 20,
    alignItems: 'center',
  },

  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  separator: {
    width: '90%',
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },

  button: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },

  allowText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d91c1c',
  },

  dontAllowText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d91c1c',
  },
});