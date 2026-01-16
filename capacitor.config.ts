import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.halalsnap.ai',
  appName: 'HalalSnap AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#059669",
      androidSplashResourceName: "splash",
      showSpinner: false
    }
  }
};

export default config;