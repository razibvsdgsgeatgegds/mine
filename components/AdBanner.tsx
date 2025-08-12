import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Dimensions } from 'react-native';

interface AdBannerProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle';
  style?: any;
}

export default function AdBanner({ size = 'banner', style }: AdBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const { width: screenWidth } = Dimensions.get('window');
  
  const getAdSize = () => {
    const maxWidth = screenWidth - 32; // Account for padding
    switch (size) {
      case 'banner':
        return { width: Math.min(320, maxWidth), height: 50 };
      case 'largeBanner':
        return { width: Math.min(320, maxWidth), height: 100 };
      case 'mediumRectangle':
        return { width: Math.min(300, maxWidth), height: 250 };
      default:
        return { width: Math.min(320, maxWidth), height: 50 };
    }
  };

  const adSize = getAdSize();

  // Simulate ad loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  // For web compatibility - AdSense optimized placeholder
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webContainer, { ...adSize }, style]}>
        <View style={styles.adContent}>
          <Text style={styles.adLabel}>Advertisement</Text>
          <Text style={styles.adProvider}>Google AdSense</Text>
        </View>
      </View>
    );
  }

  // Mobile - AdMob optimized placeholder
  // In production, replace with:
  // import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
  // 
  // return (
  //   <BannerAd
  //     unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_AD_UNIT_ID'}
  //     size={BannerAdSize.BANNER}
  //     requestOptions={{
  //       requestNonPersonalizedAdsOnly: false,
  //       keywords: ['inspiration', 'motivation', 'quotes', 'self-help'],
  //     }}
  //     onAdLoaded={() => console.log('Ad loaded')}
  //     onAdFailedToLoad={(error) => console.log('Ad failed to load:', error)}
  //   />
  // );

  return (
    <View style={[styles.mobileContainer, { ...adSize }, style]}>
      <View style={styles.adContent}>
        <Text style={styles.adLabel}>Advertisement</Text>
        <Text style={styles.adProvider}>Google AdMob</Text>
        <Text style={styles.adSize}>{size}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
    position: 'relative',
  },
  mobileContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  adContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  adLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  adProvider: {
    fontSize: 9,
    color: '#999',
    marginTop: 2,
  },
  adSize: {
    fontSize: 8,
    color: '#ccc',
    marginTop: 1,
  },
});