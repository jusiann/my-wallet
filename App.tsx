import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// SCREENS
import { Home } from './src/screens/Home';
import { Create } from './src/screens/Create';

const Stack = createNativeStackNavigator();

// APP ROUTER
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_bottom',
          contentStyle: { backgroundColor: '#0F0F1A' },
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Create"
          component={Create}
          options={{
            presentation: 'modal',
            animation: 'none',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
