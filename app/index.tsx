import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const [handle, setHandle] = useState('');
  const router = useRouter();
  const { t } = useTranslation();

  const handleSearch = () => {
    if (handle.trim()) {
      // Remove @ if present
      const cleanHandle = handle.trim().replace(/^@/, '');
      router.push(`/${cleanHandle}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.title}>{t('home.title')}</Text>
        <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={t('home.placeholder')}
            value={handle}
            onChangeText={setHandle}
            autoCapitalize="none"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.button} onPress={handleSearch}>
            <Text style={styles.buttonText}>{t('home.button')}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0085ff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#0085ff',
    paddingHorizontal: 25,
    justifyContent: 'center',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
