import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Smooth continuous rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 0.2,
        duration: 3500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Navigate AFTER delay
    const timer = setTimeout(() => {
      router.replace("/(tabs)/chat"); // ✅ CORRECT ROUTE
    }, 3500);

    return () => {
      clearTimeout(timer);
      rotateAnim.stopAnimation(); // ✅ prevent freeze
    };
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg",],
  });

  return (
    <View style={styles.container}>
      {/* IU GPT TEXT */}
      <Text style={styles.title}>IU GPT</Text>

      {/* LOGO ROTATION */}
      <Animated.View
        style={[
          styles.logoWrapper,
          { transform: [{ rotate }] },
        ]}
      >
        <Image
          source={require("../../assets/images/circle_color.png")}
          style={styles.logo}
        />
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617", // Dark blue
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 50,
    fontFamily: "InterBold",
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 10,
    letterSpacing: 1,
    textShadowColor: "rgba(255,255,255,0.7)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10  ,
  },

  logoWrapper: {
    padding: 1,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: "#ffffff",
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 25,
  },

  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
});
