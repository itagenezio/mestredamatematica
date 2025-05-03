
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a707fe40b87c478c80fb9e5f57b1b37a',
  appName: 'Mestres da Matemática',
  webDir: 'dist',
  server: {
    url: 'https://a707fe40-b87c-478c-80fb-9e5f57b1b37a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    backgroundColor: "#FFFFFF"
  }
};

export default config;
