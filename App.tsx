import React, { useState } from 'react';
import { View } from 'react-native';

import AllowPermissionScreen from './src/components/AllowPermissionScreen';
import EnterNumberScreen from './src/components/EnterNumberScreen';
import EnterOTP from './src/components/EnterOTP';

type ScreenType = 'permission' | 'enterNumber' | 'enterOTP';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('permission');
  const [phone, setPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');

  console.log("📱 CURRENT SCREEN 👉", screen);

  const handleOtpSuccess = (phoneNumber: string, code: string) => {
    console.log("🔥 OTP SUCCESS CALLBACK HIT");

    setPhone(phoneNumber);
    setCountryCode(code);

    // ✅ IMPORTANT: force re-render
    setScreen('enterOTP');
  };

  return (
    <View style={{ flex: 1 }}>

      {screen === 'permission' && (
        <AllowPermissionScreen
          onAllow={() => {
            console.log("➡️ Moving to Enter Number");
            setScreen('enterNumber');
          }}
        />
      )}

      {screen === 'enterNumber' && (
        <EnterNumberScreen
          onOtpSuccess={(phone: string, code: string) => {
            console.log("📞 OTP SUCCESS RECEIVED IN APP");
            handleOtpSuccess(phone, code);
          }}
        />
      )}

      {screen === 'enterOTP' && (
        <EnterOTP
          navigation={{
            goBack: () => {
              console.log("⬅️ Back to Enter Number");
              setScreen('enterNumber');
            }
          }}
          route={{
            params: {
              phoneNumber: phone,
              countryCode: countryCode
            }
          }}
        />
      )}

    </View>
  );
}