import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
} from "react-native";

type Props = {
  message: string;
  isUser?: boolean;
};

export default function ChatBubble({ message, isUser = false }: Props) {
  // Entry animation
  const slideAnim = useRef(new Animated.Value(isUser ? 40 : -40)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Typing effect state (ONLY for bot)
  const [displayedText, setDisplayedText] = useState(
    isUser ? message : ""
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // 🟢 Wave typing (word-by-word)
  useEffect(() => {
    if (isUser) return;

    const words = message.split(" ");
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setDisplayedText(words.slice(0, index).join(" "));
      if (index >= words.length) {
        clearInterval(interval);
      }
    }, 90); // typing speed (lower = faster)

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.botContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      {!isUser && (
        <Image
          source={require("../../assets/images/robot_icon.png")}
          style={styles.avatar}
        />
      )}

      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={styles.text}>
          {isUser ? message : displayedText}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 8,
    paddingHorizontal: 12,
  },

  userContainer: {
    justifyContent: "flex-end",
  },

  botContainer: {
    justifyContent: "flex-start",
  },

  avatar: {
    width: 55,
    height: 55, 
    marginTop: 4,
    borderWidth: 0,
    borderColor: "transparent",
  },

  bubble: {
    maxWidth: "78%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,

    // depth
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  userBubble: {
    backgroundColor: "#053f8b",
    borderTopRightRadius: 4,
  },

  botBubble: {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  borderWidth: 1,
  borderColor: "rgba(148, 163, 184, 0.18)",
  borderTopLeftRadius: 6,
  shadowColor: "#bdb5b5",
  shadowOpacity: 0.25,
  shadowRadius: 6,
  elevation: 3,
},
text: {
  color: "#f8fafc",
  fontSize: 15,
  lineHeight: 23,
  letterSpacing: 0.25,
},
});
