import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello 👋 How can I help you?" },
  ]);
  const [input, setInput] = useState("");

  const messagesEndRef = useRef(null);

  const getFalconBotReply = (text) => {
    const q = text.toLowerCase();
    if (q.includes("sell") || q.includes("trade") || q.includes("old phone") || q.includes("old device")) {
      return "To sell your device on FALCON: 1. Click 'Sell' in the navigation. 2. Select your brand and model. 3. Answer a few questions about device condition for an instant price quote. 4. Choose your doorstep pickup slot and get paid instantly upon pickup!";
    }
    if (q.includes("buy") || q.includes("refurbished") || q.includes("warranty")) {
      return "All refurbished devices on FALCON are 32-point quality checked, certified FALCON Assured, and include a 6-month warranty with a 15-day replacement guarantee!";
    }
    if (q.includes("order") || q.includes("track") || q.includes("status")) {
      return "You can view and track your orders anytime under Profile → Orders. If you've scheduled a trade-in pickup, you can review your confirmed slot in Profile → My Listings.";
    }
    if (q.includes("price") || q.includes("quote") || q.includes("calculate") || q.includes("value")) {
      return "FALCON uses dynamic algorithmic pricing based on device specifications, screen condition, physical defects, and included accessories to give you the highest possible market value.";
    }
    if (q.includes("seller") || q.includes("plan") || q.includes("subscription")) {
      return "FALCON offers Basic (₹2,999/yr), Standard (₹5,999/yr), and Premium (₹11,999/yr) seller subscriptions with lowest commission (1-1.5%), verified badges, and Super Seller priority trade-in leads.";
    }
    if (q.includes("contact") || q.includes("support") || q.includes("help") || q.includes("email") || q.includes("phone")) {
      return "You can reach the FALCON team at support@falcon.in or call +91 (800) FALCON-01. Our support agents are active 24/7!";
    }
    if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
      return "Hello! Welcome to FALCON. How can I assist you today? You can ask me about selling your old device, buying certified refurbished gadgets, seller subscriptions, or tracking orders.";
    }
    return "Thank you for reaching out! You can explore devices under 'Buy Refurbished', get an instant evaluation under 'Sell', or contact our support desk directly at support@falcon.in.";
  };

  const sendMessage = () => {
    const trimmed = input.trim();

    if (!trimmed) return;

    if (trimmed.length > 500) {
      toast.error("Message too long (max 500 chars)");
      return;
    }

    const userMessage = { from: "user", text: trimmed };

    setMessages((prev) => [
      ...prev,
      userMessage,
      { from: "bot", text: "Typing..." },
    ]);

    setTimeout(() => {
      const reply = getFalconBotReply(trimmed);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          from: "bot",
          text: reply,
        },
      ]);
    }, 600);

    setInput("");
  };
  // ✅ Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full 
        bg-gradient-to-tr from-[#1132d4] to-[#2a4bff] text-white 
        shadow-lg flex items-center justify-center 
        hover:scale-110 transition-all duration-300"
      >
        <FontAwesomeIcon icon={faComments} />
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 
        backdrop-blur-xl bg-white/80 border border-white/40 
        rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 
          bg-gradient-to-r from-[#1132d4] to-[#2a4bff] text-white"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                🤖
              </div>
              <div>
                <p className="text-sm font-semibold">FALCON Support</p>
                <p className="text-[10px] opacity-80">Online now</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-white text-sm"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 max-h-80 overflow-y-auto space-y-3 bg-blue-50/40 scrollbar-thin scrollbar-thumb-blue-300">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`inline-block max-w-[70%] px-3 py-2 text-sm rounded-2xl shadow-sm break-words ${
                    msg.from === "user"
                      ? "bg-gradient-to-r from-[#1132d4] to-[#2a4bff] text-white"
                      : "bg-white border border-gray-200 text-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* 👇 Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex items-center gap-2">
            <input
              maxLength={500}
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 text-sm rounded-full bg-gray-100 
              focus:outline-none focus:ring-2 focus:ring-[#1132d4]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full 
              bg-gradient-to-tr from-[#1132d4] to-[#2a4bff] 
              text-white flex items-center justify-center 
              hover:scale-110 transition"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
