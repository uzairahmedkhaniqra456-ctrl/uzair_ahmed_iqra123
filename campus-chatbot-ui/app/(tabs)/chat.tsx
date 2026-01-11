// Correct file
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { useEffect, useRef, useState } from "react"; 
import { 
  View,
  Text,
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
} from "react-native"; 

import { sendMessage } from "../../src/services/chatService"; 
import ChatBubble from "../../src/components/ChatBubble"; 
import TypingIndicator from "../../src/components/TypingIndicator"; 
import { generateVoucherPDF } from "../../src/utils/generateVoucherPDF";

type Message = { 
    id: string; 
    text: string; 
    sender: "user" | "bot"; 
  };

export default function ChatScreen() {
const [messages, setMessages] = useState<Message[]>([]); 
const [input, setInput] = useState(""); 
const [loading, setLoading] = useState(false); 
     
     // 🔐 AUTH STATES 
const [isAuthenticated, setIsAuthenticated] = useState(false); 
const [authenticatedRegNo, setAuthenticatedRegNo] = useState<string | null>(null); 
const [showLoginModal, setShowLoginModal] = useState(false);
const [studentRegNo, setStudentRegNo] = useState("");
const [password, setPassword] = useState(""); 
const [authError, setAuthError] = useState(""); 
const hasWelcomed = useRef(false); 
const flatListRef = useRef<FlatList>(null); 

  // 💰 FEES MODAL STATE
const [showFeesModal, setShowFeesModal] = useState(false);
const [creditHours, setCreditHours] = useState<number | null>(null);

const calculateFees = (hours: number) => {
  const perCredit = 7500;
  const admissionFee = 25000;
  const misc = 15000;
    return {
    tuition: hours * perCredit,
    admission: admissionFee,
    misc,
    total: hours * perCredit + admissionFee + misc,
  };
};
  // 🔹 Initial welcome (ONCE) 
  useEffect(() => {
     if (!hasWelcomed.current) {
       setMessages([
         { 
          
          id: "welcome_bot",
          text: "👋 Welcome to the IU AI Assistant. I can assist you with academic information, enrollment details, and fee inquiries.",
          sender: "bot",
         },
         ]);
        hasWelcomed.current = true;
       } 
      }, 
      []);
      
      
    // 🔹 Auto scroll 
  useEffect(() => { 
    setTimeout(() => { 
      flatListRef.current?.scrollToEnd({ animated: true });
     }, 100);
     }, [messages]);
     
    const handleSend = async () => { 
      const regMatch = input.match(/\b\d{4,8}\b/);
          if (regMatch) {
            const enteredReg = regMatch[0];

            if (!isAuthenticated || enteredReg !== authenticatedRegNo) {
              setStudentRegNo(enteredReg);
              setShowLoginModal(true);
              setInput("");
              return; // ⛔ STOP backend call
            }
          }
      const trimmedInput = input.trim().toLowerCase();

    // 💰 Detect credit hour fee query (e.g. "15 credit hour fees")
    const creditMatch = trimmedInput.match(/(\d+)\s*credit/i);
    // 🔒 Protect sensitive queries
     if (creditMatch) {
        if (!isAuthenticated) {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              text: "🔒 Please authenticate to view fees.",
              sender: "bot",
            },
          ]);
          setInput("");
          return;
        }
        const hours = Number(creditMatch[1]);
        setCreditHours(hours);
        setShowFeesModal(true);
        setInput("");
        setLoading(false);
        return;
}
    const userMessage: Message = { 
      id: Date.now().toString(),
      text: input, 
      sender: "user", 
    }; 
    
    setMessages((prev) => [...prev, userMessage]); 
    setInput(""); 
    setLoading(true); 
    try { 
      const botReply = await sendMessage(userMessage.text); 
      setMessages((prev) => [ 
        ...prev, 
        { 
          id: Date.now().toString() + "_bot", 
          text: botReply, 
          sender: "bot", 
        }, 
      ]); 
    } catch { 
      setMessages((prev) => [ 
        ...prev, 
        { 
          id: Date.now().toString(), 
          text: "The system is processing your request. Please try again.", 
          sender: "bot", 
        }, 
      ]); 
    } finally { 
      setLoading(false); 
    } 
  }; 

  // 🔐 LOGIN HANDLER (PASSWORD REQUIRED) 
  const handleLogin = () => {
  if (!password.trim()) {
    setAuthError("Password is required");
    return;
  }

  setIsAuthenticated(true);
  setAuthenticatedRegNo(studentRegNo);
  setShowLoginModal(false);
  setPassword("");
  setAuthError("");

  setMessages((prev) => [
    ...prev,
    {
      id: Date.now().toString(),
      text: `🎓 Welcome ${studentRegNo}! You are now authenticated.`,
      sender: "bot",
    },
  ]);
};
     
return ( <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : undefined} 
      > 

      {/* 🔹 HEADER */} 
      <View style={styles.header}> 
        <View style={styles.headerLeft}> 
          <View style={styles.logoCircle}> 
            <Image 
            source={require("../../assets/images/iu.png")} 
            style={styles.logoImage} 
            />
            </View> 
            <Text style={styles.headerTitle}>AI Assistant</Text> 
            </View> 
            <View>
          <Image
            source={require("../../assets/images/icon_02.png")}
            style={styles.userAvatarImage}
          />
        </View>
              </View> 
              
              {/* 🔐 LOGIN MODAL*/ } 
              {showLoginModal && ( 
                <View style={styles.modalOverlay}> 
                <View style={styles.modalCard}> 
                  {/* Background image */} 
                  <Image 
                  style={styles.modalBgImage} 
                  /> 
                  {/* Dark overlay */} 
                  <View style={styles.modalOverlayInner}/> 
                  {/* ❌ Close Button */} 
                  <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => { 
                    setShowLoginModal(false); 
                    setPassword(""); 
                    setAuthError(""); 
                  }} 
                  activeOpacity={0.8} 
                  > 
                  <Ionicons name="close" size={22} color="#ffffff" /> 
                  </TouchableOpacity>

                  {/* Content */} 
                  <View style={styles.modalContent}> 
                    {/* University Logo */} 
                    {/* University Logo */} 
                    <View style={styles.authLogoWrapper}> 
                      <Image 
                      source={require("../../assets/images/logo.png")} 
                      style={styles.authLogo} 
                      /> 
                      </View> 
                    <Text style={styles.modalTitle}>Student Authentication</Text> 
                    
                {/* Registration */} 
                <Text style={styles.inputLabel}>Registration Number</Text> 
                <TextInput 
                style={styles.modalInput} 
                value={studentRegNo} 
                editable={false} 
                /> 
                
                {/* Password */} 
                <Text style={styles.inputLabel}>Password</Text> 
                <TextInput 
                style={styles.modalInput}
                placeholder="Enter your password" 
                placeholderTextColor="#94a3b8" 
                secureTextEntry 
                value={password} 
                onChangeText={setPassword} 
                /> 
                
                {authError ? ( 
                  <Text style={styles.errorText}>{authError}</Text> 
                ) : null} 
                
                {/* Animated Button */} 
                <TouchableOpacity 
                style={[ 
                  styles.modalButton, 
                  !password && { opacity: 0.6 }, 
                ]} 
                onPress={handleLogin} 
                activeOpacity={0.85} 
                disabled={!password} 
                > 
                <Text style={styles.modalButtonText}> 
                  Verify & Continue 
                  </Text> 
                </TouchableOpacity> 
                </View> 
              </View> 
            </View> 
            )} 
            {/* 💰 FEES MODAL */}
{showFeesModal && creditHours !== null && (
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>

          {/* ❌ Close Button */}
    <TouchableOpacity
      style={styles.closeButton_new}
      onPress={() => {
        setShowFeesModal(false);
        setCreditHours(null);
        setLoading(false);
      }}
      activeOpacity={0.8}
    >
      <Ionicons name="close" size={22} color="#ffffff" />
    </TouchableOpacity>

{(() => {
  const fees = calculateFees(creditHours);

  return (
    <View style={styles.voucherCard}>

      {/* Title */}
      <Text style={styles.voucherTitle}>Fees Voucher</Text>

      {/* Student Info */}
      <View style={styles.voucherRow}>
        <Text style={styles.voucherLabel}>Registration No</Text>
        <Text style={styles.voucherValue}>{authenticatedRegNo}</Text>
      </View>

      <View style={styles.voucherRow}>
        <Text style={styles.voucherLabel}>Credit Hours</Text>
        <Text style={styles.voucherValue}>{creditHours}</Text>
      </View>

      <View style={styles.divider} />

      {/* Fees Breakdown */}
      <View style={styles.voucherRow}>
        <Text style={styles.voucherLabel}>Tuition Fee</Text>
        <Text style={styles.voucherValue}>Rs. {fees.tuition}</Text>
      </View>

      <View style={styles.voucherRow}>
        <Text style={styles.voucherLabel}>Admission Fee</Text>
        <Text style={styles.voucherValue}>Rs. {fees.admission}</Text>
      </View>

      <View style={styles.voucherRow}>
        <Text style={styles.voucherLabel}>Misc Charges</Text>
        <Text style={styles.voucherValue}>Rs. {fees.misc}</Text>
      </View>

      <View style={styles.divider} />

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Payable</Text>
        <Text style={styles.totalAmount}>Rs. {fees.total}</Text>
      </View>
        <TouchableOpacity
          style={[
            styles.modalButton,
            { backgroundColor: "#053fbfcc", marginTop: 14 },
          ]}
          onPress={() => {
            const fees = calculateFees(creditHours!);

            generateVoucherPDF({
              studentName: "Authenticated Student", // demo-safe
              registrationNo: authenticatedRegNo!,
              creditHours: creditHours!,
              tuition: fees.tuition,
              admission: fees.admission,
              misc: fees.misc,
              total: fees.total,
            });
          }}
        >
          <Text style={styles.modalButtonText}>
            Download PDF / Print
          </Text>
        </TouchableOpacity>
      </View>
    );
  })()} 
      </View>
    </View>
  )} 
            <FlatList 
            ref={flatListRef} 
            data={messages} 
            keyExtractor={(item) => item.id} 
            renderItem={({ item }) => ( 
            <ChatBubble message={item.text} isUser={item.sender === "user"} /> 
          )}
          contentContainerStyle={styles.chatArea} 
          showsVerticalScrollIndicator={false} 
          /> 
          
          {loading && <TypingIndicator />} 

          <View style={styles.inputContainer}> 
            <TextInput 
            style={styles.input} 
            placeholder="Ask something..." 
            placeholderTextColor="#64748b" 
            value={input} 
            onChangeText={setInput} 
            />
            <TouchableOpacity 
            style={[styles.sendButton, loading && 
              styles.sendButtonDisabled]} 
              onPress={handleSend} 
              disabled={loading} 
              > 
              <Ionicons 
              name={loading ? "time-outline" : "send"} 
              size={20}
              color="#fff" 
              /> 
            </TouchableOpacity> 
            </View> 
    </KeyboardAvoidingView>
  );
}
    /* ================= STYLES ================= */ 
    const styles = StyleSheet.create({ 
      container: { flex: 1, backgroundColor: "#020617" }, 
      header: { 
        height: 56, 
        backgroundColor: "#020617", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between", 
        paddingHorizontal: 14, 
        borderBottomWidth: 1, 
        borderColor: "#1e293b", 
      }, 
      headerLeft: { 
        flexDirection: "row", 
        alignItems: "center", 
        gap: 10 
      }, 
      headerTitle: { 
        fontSize: 16, 
        fontWeight: "600", 
        color: "#e5e7eb" 
      }, 
        logoCircle: { 
          width: 36, 
          height: 36, 
          borderRadius: 18, 
          backgroundColor: "#fff", 
          alignItems: "center", 
          justifyContent: "center", 
        }, 
        logoImage: { 
            width: 50, 
            height: 50, 
            resizeMode: "contain" 
          }, 
       userAvatarImage: {
          width: 40,
          height: 40,
          resizeMode: "contain",
        },
        userInitial: { 
            color: "#fff", 
            fontWeight: "700", fontSize: 16 
          }, 
          chatArea: { 
            paddingVertical: 12 

            }, 
            inputContainer: { 
              flexDirection: "row", 
              padding: 10, 
              borderTopWidth: 1, 
              borderColor: "#1e293b", 
              backgroundColor: "#020617", 
            }, 
            input: { 
                flex: 1, 
                backgroundColor: "#020617", 
                color: "#fff", 
                paddingVertical: 12, 
                paddingHorizontal: 14, 
                borderRadius: 14, 
                borderWidth: 1, 
                borderColor: "#1e293b", 
              }, 
                sendButton: { 
                  marginLeft: 8, 
                  backgroundColor: "#053f8b", 
                  width: 44, 
                  height: 44, 
                  borderRadius: 22, 
                  alignItems: "center", 
                  justifyContent: "center", 
                }, 
                  sendButtonDisabled: { 
                    backgroundColor: "#334155", 
                    opacity: 0.6 },

                   /* 🔐 MODAL */ 
                   
                   modalOverlay: { 
                    position: "absolute", 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    backgroundColor: "rgba(0,0,0,0.65)", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    zIndex: 10, 
                  }, 
                    modalCard: {
                       width: "82%", 
                       borderRadius: 20, 
                       overflow: "hidden", 
                       position: "relative", 
                       borderWidth: 1, 
                       borderColor: "rgba(96,165,250,0.35)", 
                       shadowColor: "#60a5fa" , 
                       shadowOffset: { width: 0, height: 0 }, 
                       shadowOpacity: 0.8, 
                       shadowRadius: 18, 
                       elevation: 18, // Android glow 
                       },
                        
                       modalBgImage: {
                         position: "absolute", 
                         width: "100%", 
                         height: "100%", 
                         resizeMode: "cover", 
                         alignSelf: "center", 
                        }, 
                        
                         modalOverlayInner: {
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "rgba(2,6,23,0.92)", // darker & cleaner
                        },

                          modalContent: { 
                            padding: 24, 
                            zIndex: 2, 
                          }, 
                          /* Logo (NOT rounded) */ 
                          authLogoWrapper: { 
                            alignItems: "center", 
                            marginBottom: 10, 

                          }, 
                          authLogo: { 
                            width: 150, 
                            height: 60, 
                            resizeMode: "contain", 
                            backgroundColor: "transparent", 

                          }, 
                          
                          /* Title highlight */ 
                        modalTitle: { 
                          color: "#ffffff", 
                          fontSize: 20, 
                          fontWeight: "700", 
                          textAlign: "center", 
                          marginBottom: 20, 
                          textShadowColor: "rgba(37,99,235,0.6)", 
                          textShadowOffset: { width: 0, height: 2 }, 
                        textShadowRadius: 6, 
                      }, 
                        inputLabel: { 
                          color: "#94a3b8", 
                          fontSize: 13, 
                          marginBottom: 4, 

                        }, 
                        modalInput: { 
                          backgroundColor: "rgba(2,6,23,0.9)", 
                          borderWidth: 1, 
                          borderColor: "#334155", 
                          color: "#fff", 
                          paddingVertical: 12, 
                          paddingHorizontal: 14, 
                          borderRadius: 12, 
                          marginBottom: 14, 

                        }, 
                        modalButton: { 
                          backgroundColor: "#053f8b", 
                          paddingVertical: 14, 
                          borderRadius: 14, 
                          alignItems: "center", 
                          marginTop: 6, 
                          transform: [{ scale: 1 }], 
                      }, 
                        modalButtonText: { 
                          color: "#fff", 
                          fontWeight: "600", 
                          fontSize: 15, 

                        }, 
                        /* Glowing Close Button */ 
                        closeButton: {
                            position: "absolute",
                            top: 12,
                            right: 12,
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: "rgba(15,23,42,0.9)",
                            borderWidth: 1,
                            borderColor: "rgba(59,130,246,0.5)",
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: "#3b82f6",
                            shadowRadius: 10,
                            elevation: 12,
                          },

                        errorText: { 
                          color: "#f87171", 
                          fontSize: 13, 
                          marginBottom: 8, 
                          textAlign: "center", 

                        }, 
                        feeText: {
                            color: "#e5e7eb",
                            fontSize: 14,
                            marginBottom: 6,
                          },
/* ================= FEES VOUCHER STYLES ================= */

                        voucherCard: {
                          backgroundColor: "#020617",
                          borderRadius: 18,
                          padding: 20,
                          borderWidth: 1,
                          borderColor: "#053f8b",
                          shadowColor: "#053f8b",
                          shadowOpacity: 0.8,
                          shadowRadius: 18,
                          elevation: 18,
                        },

                        voucherTitle: {
                          color: "#ffffff",
                          fontSize: 20,
                          fontWeight: "700",
                          textAlign: "center",
                          marginBottom: 18,
                          textShadowColor: "rgba(37,99,235,0.8)",
                          textShadowOffset: { width: 0, height: 2 },
                          textShadowRadius: 6,
                        },

                        voucherRow: {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 10,
                        },

                        voucherLabel: {
                          color: "#94a3b8",
                          fontSize: 14,
                        },

                        voucherValue: {
                          color: "#e5e7eb",
                          fontSize: 14,
                          fontWeight: "600",
                        },

                        divider: {
                          height: 1,
                          backgroundColor: "#1e293b",
                          marginVertical: 12,
                        },

                        totalRow: {
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 10,
                        },

                        totalLabel: {
                          color: "rgb(255 0 0)",
                          fontSize: 16,
                          fontWeight: "700",
                        },

                        totalAmount: {
                          color: "rgb(255 0 0)",
                          fontSize: 16,
                          fontWeight: "800",
                        },
                        closeButton_new: {
                          position: "absolute",
                          top: 12,
                          right: 12,
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          alignItems: "center",
                          justifyContent: "center",
                          borderWidth: 1,
                          borderColor: "rgba(255,255,255,0.35)",
                          shadowColor: "#ffffff",
                          shadowOpacity: 0.9,
                          shadowRadius: 8,
                          elevation: 12,
                          zIndex: 10,
                        },
                      });
