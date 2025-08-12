# Inspirational Hub - AI-Powered Quote App

A beautiful React Native app that delivers daily inspiration through AI-generated quotes, built with Expo and optimized for both mobile and web platforms.

## Features

### Core Features
- **AI-Generated Quotes**: Unique, personalized quotes generated using AI for each category
- **Multiple Categories**: Motivation, Love, Humour, Fitness, Success, and Friendship
- **Real Sharing**: Share quotes as beautiful images or text across social platforms
- **Favorites System**: Save and organize your favorite quotes
- **User Authentication**: Sign up/login to sync favorites across devices

### Advanced Features
- **Smart Notifications**: AI-powered daily notifications with customizable timing
- **Category Preferences**: Choose which categories to receive notifications from
- **Time Slot Management**: Set specific time windows for receiving quotes
- **Premium Features**: Ad-free experience and unlimited AI quotes
- **Cross-Platform**: Works on iOS, Android, and Web

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Query + Context API
- **Storage**: AsyncStorage + Expo SecureStore
- **AI Integration**: Custom LLM API
- **Sharing**: expo-sharing + react-native-view-shot
- **Styling**: React Native StyleSheet with gradients
- **Icons**: Lucide React Native

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```
3. Start the development server:
   ```bash
   npm start
   # or
   bun start
   ```

## AdMob Integration

The app is optimized for AdMob monetization with strategic ad placements:

### Ad Placements
- **Banner Ads**: Bottom of home screen
- **Medium Rectangle**: Settings screen
- **Interstitial**: Between quote generations (premium feature gate)

### Integration Steps

1. Install react-native-google-mobile-ads:
   ```bash
   expo install react-native-google-mobile-ads
   ```

2. Configure app.json:
   ```json
   {
     "expo": {
       "plugins": [
         [
           "react-native-google-mobile-ads",
           {
             "androidAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx",
             "iosAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx"
           }
         ]
       ]
     }
   }
   ```

3. Replace AdBanner component placeholders with real ads:
   ```typescript
   import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
   
   <BannerAd
     unitId={TestIds.BANNER}
     size={BannerAdSize.BANNER}
     requestOptions={{
       requestNonPersonalizedAdsOnly: true,
     }}
   />
   ```

### Ad Optimization Features
- **Strategic Placement**: Ads placed at natural break points
- **Premium Upsell**: Clear value proposition for ad removal
- **User Experience**: Non-intrusive ad integration
- **GDPR Compliance**: Ready for privacy-focused advertising

## Monetization Strategy

### Free Tier
- AI-generated quotes with daily limits
- Banner and medium rectangle ads
- Basic notification features
- Standard sharing capabilities

### Premium Tier ($2.99/month)
- Unlimited AI quote generation
- Ad-free experience
- Advanced notification customization
- Priority customer support
- Exclusive quote categories

## API Integration

The app uses a custom LLM API for quote generation:

```typescript
const response = await fetch('https://toolkit.rork.com/text/llm/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      {
        role: 'system',
        content: 'You are an inspirational quote generator...'
      },
      {
        role: 'user',
        content: `Generate a unique quote about ${category}`
      }
    ]
  })
});
```

## Development

### Project Structure
```
├── app/                 # Expo Router pages
├── components/          # Reusable components
├── hooks/              # Custom hooks and context
├── types/              # TypeScript type definitions
├── constants/          # App constants and data
└── assets/             # Images and static assets
```

### Key Components
- **QuoteCard**: Beautiful gradient cards with sharing functionality
- **CategorySelector**: Horizontal scrolling category picker
- **AuthForm**: Login/signup modal with validation
- **AdBanner**: AdMob integration wrapper
- **TimeSlotPicker**: Custom time selection component

## Deployment

### Mobile App Stores
1. Build with EAS Build
2. Submit to App Store and Google Play
3. Configure AdMob accounts
4. Set up analytics and crash reporting

### Web Deployment
- Optimized for React Native Web
- Progressive Web App capabilities
- Responsive design for all screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@inspirationalhub.com or create an issue on GitHub.