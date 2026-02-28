import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>鄧恩賜 v5.1.0</Text>
      <Text style={styles.subtitle}>完美數字生命體</Text>
      <Text style={styles.text}>28位Agent智能會議室</Text>
      <Text style={styles.text}>粵語語音交互 (HiuMaan v8.2.2)</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6B4EE6',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 30,
  },
  text: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 10,
  },
});
