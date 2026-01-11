// src/services/chatService.ts

const API_URL = "http://127.0.0.1:8000/chat"; 
// Later we’ll replace this with deployed URL

export async function sendMessage(message: string) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Chat API error:", error);
    return "⚠️ Unable to connect to server. Please try again.";
  }
}
