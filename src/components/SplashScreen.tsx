import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import AllowPermissionScreen from './AllowPermissionScreen';

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!showSplash) {
    return <AllowPermissionScreen />;
  }
  return (
    <LinearGradient
      colors={['#ffffff', '#ff6a6a', '#E21B14']}
      locations={[0, 0.8, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>
        
        {/* Logo */}
        <View>
          <Image
          source={require('../../assets/logo.png')} // 👈 same style image use karna
          resizeMode="contain"
          style={styles.logoImage}
        />
        </View>

        {/* Title */}
        <Text style={styles.title}>Car Hauling</Text>

        {/* Car Image */}
        <Image
          source={require('../../assets/car.png')} // 👈 same style image use karna
          style={styles.carImage}
          resizeMode="contain"
        />

        {/* Bottom Content */}
        <View style={styles.bottomContainer}>
          <Text style={styles.headingWhite}>Smart Container</Text>
          <Text style={styles.headingRed}>Delivery</Text>

          <Text style={styles.description}>
            Seamless vehicle transport powered by{'\n'}
            Reliable logistics and precision on every wheel.
          </Text>

          <Pressable
            style={({pressed}) => [
              styles.button,
              pressed && styles.buttonHover,
            ]}>
            {({pressed}) => (
              <Text
                style={[
                  styles.buttonText,
                  pressed && styles.buttonTextHover,
                ]}>
                Get Started
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
  },
  logoImage: {
    width: 130,
    height: 132,
    marginTop: 20,
  },

  logoBox: {
    marginTop: 20,
    width: 70,
   
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 4,
    borderColor: '#ff0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 28,
    fontFamily: 'Arimo-Bold',
    color: '#ff0000',
  },

  title: {
    marginTop: 0,
    fontSize: 54,
    fontFamily: 'Arimo-Bold',
    color: '#d91c1c',
  },

  carImage: {
    width: '90%',
    height: 220,
    marginTop: 10,
  },

  bottomContainer: {
    marginTop: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    
  },

  headingWhite: {
    fontSize: 40,
    fontFamily: 'Arimo-Bold',
    color: '#ffffff',
    
  },
  headingRed: {
    fontSize: 40,
    fontFamily: 'Arimo-Bold',
    color: '#A20707',
  },

  description: {
    marginTop: 10,
    fontSize: 15,
    fontFamily: 'Arimo-Regular',
    color: '#000',
    textAlign: 'left',
    lineHeight:20,
  },

  button: {
    marginTop: 25,
    backgroundColor: '#f2f2f2',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    elevation: 5,
    alignSelf: 'center',
  },
  buttonHover: {
    backgroundColor: '#000',
  },

  buttonText: {
    fontSize: 24,
    fontFamily: 'Arimo-Bold',
    color: '#d91c1c',
  },
  buttonTextHover: {
    color: '#fff',
  },
  loaderContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -18 }, { translateY: -18 }],
  },
});
