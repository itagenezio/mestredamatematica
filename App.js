import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

export default function App() {
  const handleStart = async () => {
    // URL onde o jogo será publicado ou IP local se estiver no mesmo Wi-Fi
    // Por enquanto, vamos tentar abrir o endereço padrão do Vite se estiver rodando com tunnel
    // Ou uma URL de produção se você já tiver uma.
    const url = 'https://mestredamatematica.vercel.app'; // Substitua pela sua URL real

    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('Erro ao abrir o jogo:', error);
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mestres da Matemática</Text>
      <Text style={styles.subtitle}>Projeto Prof. Genezio de Lavor</Text>
      <View style={styles.card}>
        <Text style={styles.description}>
          Aprenda matemática de forma divertida e interativa!
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Iniciar Jogo</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9b87f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.8,
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#F97316',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 35,
    width: '100%',
    shadowColor: '#F97316',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 