  import { useEffect, useState } from "react";
  import { View, Text, StyleSheet, Image } from "react-native";

  export default function TypingIndicator() {
    const [dots, setDots] = useState(".");

    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
      }, 450);

      return () => clearInterval(interval);
    }, []);

    return (
      <View style={styles.container}>
        {/* Bot Avatar */}
        <Image
          source={require("../../assets/images/robot_icon.png")}
          style={styles.avatar}
        />
        {/* Bubble */}
        <View style={styles.bubble}>
          <Text style={styles.text}>Typing{dots}</Text>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      marginVertical: 6,
    },

    avatar: {
      width: 50,
      height: 50,
      borderWidth: 0,
      borderColor: "transparent",
    },

    bubble: {
      backgroundColor: "rgba(15,23,42,0.95)",
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 16,
      borderTopLeftRadius: 4,
      borderWidth: 1,
      borderColor: "rgba(59,130,246,0.25)",
      shadowColor: "#3b82f6",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 5,
    },

    text: {
      color: "#e5e7eb",
      fontSize: 13.5,
      letterSpacing: 0.3,
    },
  });
