import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

// Empty student home. Login, plan and lesson player arrive in Phase 1 using @platform/ui.
export default function App() {
  return (
    <View>
      <Text accessibilityRole="header">Student</Text>
      <StatusBar style="auto" />
    </View>
  );
}
