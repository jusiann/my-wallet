import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { Home } from './src/screens/Home';
import { Create } from './src/screens/Create';
import { List } from './src/screens/List';
import { CategorySummary } from './src/screens/CategorySummary';
import { WalletIcon } from './src/components/WalletIcon';

const COLORS = {
  background: '#0F0F1A',
  cardBackground: '#1A1A2E',
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  textPrimary: '#FFFFFF',
  textMuted: '#6B7280',
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const tabConfig: Record<string, { icon: any; iconFocused: any; label: string }> = {
            CreateTab: { icon: 'add-outline', iconFocused: 'add', label: 'Add' },
            HomeTab: { icon: 'wallet-outline', iconFocused: 'wallet', label: 'Home' },
            ListTab: { icon: 'receipt-outline', iconFocused: 'receipt', label: 'History' },
          };

          const config = tabConfig[route.name] || { icon: 'help-circle-outline', iconFocused: 'help-circle', label: '' };

          if (route.name === 'HomeTab') {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.centerButton}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.centerButtonInner,
                  isFocused && styles.centerButtonActive
                ]}>
                  <WalletIcon size={32} color={COLORS.textPrimary} />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFocused ? config.iconFocused : config.icon}
                size={28}
                color={isFocused ? COLORS.primary : COLORS.textMuted}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="HomeTab"
    >
      <Tab.Screen name="CreateTab" component={Create} />
      <Tab.Screen name="HomeTab" component={Home} />
      <Tab.Screen name="ListTab" component={List} />
    </Tab.Navigator>
  );
}

export default function App() {
  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: COLORS.background,
      card: COLORS.cardBackground,
      text: COLORS.textPrimary,
      border: 'transparent',
    },
  };

  return (
    <NavigationContainer theme={MyDarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_bottom',
          contentStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Create"
          component={Create}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="CategorySummary"
          component={CategorySummary}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButtonActive: {
    backgroundColor: COLORS.primaryLight,
  },
});
