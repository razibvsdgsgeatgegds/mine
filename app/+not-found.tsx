import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found', headerShown: false }} />
      <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
        <View style={styles.content}>
          <AlertCircle size={64} color="#667eea" style={styles.icon} />
          <Text style={styles.title}>Oops! Page Not Found</Text>
          <Text style={styles.subtitle}>The page you&apos;re looking for doesn&apos;t exist.</Text>
          
          <Link href="/(tabs)" style={styles.link}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.linkGradient}
            >
              <Text style={styles.linkText}>Go to Home</Text>
            </LinearGradient>
          </Link>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  link: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  linkGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
