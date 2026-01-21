"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { UserPanel, ChatMessage } from "@/components/user-panel";
import { AnimationZone, AnimationPhase } from "@/components/animation-zone";
import { generateKeyPair, encryptMessage, decryptMessage, KeyPair } from "@/lib/crypto";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Dark mode
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // Key pairs for both users
  const [aliceKeys, setAliceKeys] = useState<KeyPair | null>(null);
  const [bobKeys, setBobKeys] = useState<KeyPair | null>(null);

  // Track if keys have been generated before (for showing "changed" vs "created")
  const aliceHadKeys = useRef(false);
  const bobHadKeys = useRef(false);

  // Loading states
  const [aliceGenerating, setAliceGenerating] = useState(false);
  const [bobGenerating, setBobGenerating] = useState(false);

  // Animation state
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("idle");
  const [animationDirection, setAnimationDirection] = useState<"left-to-right" | "right-to-left">("left-to-right");
  const [currentMessage, setCurrentMessage] = useState("");
  const [encryptedData, setEncryptedData] = useState("");

  // Chat messages for each user
  const [aliceChatMessages, setAliceChatMessages] = useState<ChatMessage[]>([]);
  const [bobChatMessages, setBobChatMessages] = useState<ChatMessage[]>([]);

  // Encrypted and decrypted messages (for pending decrypt)
  const [aliceEncrypted, setAliceEncrypted] = useState("");
  const [aliceDecrypted, setAliceDecrypted] = useState("");
  const [bobEncrypted, setBobEncrypted] = useState("");
  const [bobDecrypted, setBobDecrypted] = useState("");

  // Mobile view toggle
  const [mobileView, setMobileView] = useState<"alice" | "bob">("alice");

  // Key generation handlers
  const handleAliceGenerateKeys = useCallback(async () => {
    setAliceGenerating(true);
    await new Promise((r) => setTimeout(r, 500));
    const keys = await generateKeyPair();
    setAliceKeys(keys);
    setAliceGenerating(false);

    // Add system message to BOTH chats
    const systemMessage: ChatMessage = {
      type: "system",
      content: aliceHadKeys.current
        ? "Alice's security keys changed"
        : "Alice created security keys",
    };
    setAliceChatMessages((prev) => [...prev, systemMessage]);
    setBobChatMessages((prev) => [...prev, systemMessage]);

    aliceHadKeys.current = true;
  }, []);

  const handleBobGenerateKeys = useCallback(async () => {
    setBobGenerating(true);
    await new Promise((r) => setTimeout(r, 500));
    const keys = await generateKeyPair();
    setBobKeys(keys);
    setBobGenerating(false);

    // Add system message to BOTH chats
    const systemMessage: ChatMessage = {
      type: "system",
      content: bobHadKeys.current
        ? "Bob's security keys changed"
        : "Bob created security keys",
    };
    setAliceChatMessages((prev) => [...prev, systemMessage]);
    setBobChatMessages((prev) => [...prev, systemMessage]);

    bobHadKeys.current = true;
  }, []);

  // Send message from Alice to Bob
  const handleAliceSendMessage = useCallback(
    async (message: string) => {
      if (!bobKeys || !aliceKeys) return;

      // Add to Alice's chat as sent
      setAliceChatMessages((prev) => [...prev, { type: "sent", content: message }]);

      setCurrentMessage(message);
      setAnimationDirection("left-to-right");
      setBobEncrypted("");
      setBobDecrypted("");

      setAnimationPhase("encrypting");
      await new Promise((r) => setTimeout(r, 1200));

      const encrypted = await encryptMessage(message, bobKeys.publicKey);
      setEncryptedData(encrypted);

      setAnimationPhase("sending");
      await new Promise((r) => setTimeout(r, 1500));

      setAnimationPhase("waiting");
      setBobEncrypted(encrypted);

      // On mobile, switch to Bob's view after sending
      setMobileView("bob");
    },
    [aliceKeys, bobKeys]
  );

  // Send message from Bob to Alice
  const handleBobSendMessage = useCallback(
    async (message: string) => {
      if (!aliceKeys || !bobKeys) return;

      // Add to Bob's chat as sent
      setBobChatMessages((prev) => [...prev, { type: "sent", content: message }]);

      setCurrentMessage(message);
      setAnimationDirection("right-to-left");
      setAliceEncrypted("");
      setAliceDecrypted("");

      setAnimationPhase("encrypting");
      await new Promise((r) => setTimeout(r, 1200));

      const encrypted = await encryptMessage(message, aliceKeys.publicKey);
      setEncryptedData(encrypted);

      setAnimationPhase("sending");
      await new Promise((r) => setTimeout(r, 1500));

      setAnimationPhase("waiting");
      setAliceEncrypted(encrypted);

      // On mobile, switch to Alice's view after sending
      setMobileView("alice");
    },
    [aliceKeys, bobKeys]
  );

  // Decrypt handlers
  const handleBobDecrypt = useCallback(async () => {
    if (!bobKeys || !bobEncrypted) return;

    setAnimationPhase("decrypting");
    await new Promise((r) => setTimeout(r, 1000));

    const decrypted = await decryptMessage(bobEncrypted, bobKeys.privateKey);
    setBobDecrypted(decrypted);

    // Add to Bob's chat as received
    setBobChatMessages((prev) => [...prev, { type: "received", content: decrypted }]);

    setAnimationPhase("complete");
    await new Promise((r) => setTimeout(r, 1500));
    setAnimationPhase("idle");

    // Clear the encrypted message after adding to chat
    setBobEncrypted("");
    setBobDecrypted("");
  }, [bobKeys, bobEncrypted]);

  const handleAliceDecrypt = useCallback(async () => {
    if (!aliceKeys || !aliceEncrypted) return;

    setAnimationPhase("decrypting");
    await new Promise((r) => setTimeout(r, 1000));

    const decrypted = await decryptMessage(aliceEncrypted, aliceKeys.privateKey);
    setAliceDecrypted(decrypted);

    // Add to Alice's chat as received
    setAliceChatMessages((prev) => [...prev, { type: "received", content: decrypted }]);

    setAnimationPhase("complete");
    await new Promise((r) => setTimeout(r, 1500));
    setAnimationPhase("idle");

    // Clear the encrypted message after adding to chat
    setAliceEncrypted("");
    setAliceDecrypted("");
  }, [aliceKeys, aliceEncrypted]);

  const bothHaveKeys = aliceKeys !== null && bobKeys !== null;
  const canSend = bothHaveKeys && animationPhase === "idle";

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-zinc-100 dark:bg-zinc-950 p-2 sm:p-3">
      {/* Header */}
      <header className="text-center mb-2 flex-shrink-0">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <h1 className="text-base sm:text-xl font-bold">🔐 E2E Encryption Demo</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDark(!isDark)}
            className="text-xs h-6 sm:h-7 px-2"
          >
            {isDark ? "☀️" : "🌙"}
          </Button>
        </div>
      </header>

      {/* How it works - compact, hidden on very small screens */}
      <div className="hidden sm:block max-w-2xl mx-auto mb-2 px-3 py-1.5 bg-zinc-200 dark:bg-zinc-900 rounded-lg flex-shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground justify-center flex-wrap">
          <span>1️⃣ Generate keys</span>
          <span className="text-zinc-400">→</span>
          <span>2️⃣ Encrypt with <strong className="text-green-600 dark:text-green-400">public key</strong></span>
          <span className="text-zinc-400">→</span>
          <span>3️⃣ Decrypt with <strong className="text-red-600 dark:text-red-400">private key</strong></span>
        </div>
      </div>

      {/* Mobile User Toggle */}
      <div className="md:hidden flex justify-center mb-2 flex-shrink-0">
        <div className="inline-flex rounded-lg border border-zinc-300 dark:border-zinc-700 p-0.5 bg-zinc-200 dark:bg-zinc-800">
          <button
            onClick={() => setMobileView("alice")}
            className={`px-4 py-1 text-xs font-medium rounded-md transition-colors ${
              mobileView === "alice"
                ? "bg-white dark:bg-zinc-900 text-pink-600 dark:text-pink-400 shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            👩 Alice
          </button>
          <button
            onClick={() => setMobileView("bob")}
            className={`px-4 py-1 text-xs font-medium rounded-md transition-colors ${
              mobileView === "bob"
                ? "bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            👨 Bob
          </button>
        </div>
      </div>

      {/* Main Demo Area */}
      <div className="flex-1 max-w-6xl mx-auto w-full min-h-0 flex flex-col md:grid md:grid-cols-[1fr_minmax(160px,220px)_1fr] gap-2 sm:gap-3">
        {/* Alice Panel - Hidden on mobile when Bob is selected */}
        <div className={`${mobileView === "alice" ? "flex" : "hidden"} md:flex flex-col min-h-0 flex-1`}>
          <UserPanel
            name="Alice"
            color="border-pink-400 dark:border-pink-600"
            keyPair={aliceKeys}
            onGenerateKeys={handleAliceGenerateKeys}
            onSendMessage={handleAliceSendMessage}
            encryptedMessage={aliceEncrypted}
            decryptedMessage={aliceDecrypted}
            onDecrypt={handleAliceDecrypt}
            isGenerating={aliceGenerating}
            canSend={canSend}
            bothHaveKeys={bothHaveKeys}
            otherUserName="Bob"
            chatMessages={aliceChatMessages}
          />
        </div>

        {/* Animation Zone - Hidden on mobile, visible on tablet+ */}
        <div className="hidden md:flex bg-zinc-200 dark:bg-zinc-900 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 min-h-0">
          <AnimationZone
            phase={animationPhase}
            direction={animationDirection}
            originalMessage={currentMessage}
            encryptedData={encryptedData}
            senderName={animationDirection === "left-to-right" ? "Alice" : "Bob"}
            receiverName={animationDirection === "left-to-right" ? "Bob" : "Alice"}
          />
        </div>

        {/* Mobile Animation Status - Shows on mobile only */}
        {animationPhase !== "idle" && (
          <div className="md:hidden flex-shrink-0 py-2 px-3 bg-zinc-200 dark:bg-zinc-900 rounded-lg text-center">
            <div className="text-xs text-muted-foreground">
              {animationPhase === "encrypting" && `🔐 Encrypting with ${animationDirection === "left-to-right" ? "Bob" : "Alice"}'s public key...`}
              {animationPhase === "sending" && "✉️ Sending encrypted message..."}
              {animationPhase === "waiting" && "📬 Message delivered! Waiting for decryption..."}
              {animationPhase === "decrypting" && "🔓 Decrypting with private key..."}
              {animationPhase === "complete" && "✅ Decrypted successfully!"}
            </div>
          </div>
        )}

        {/* Bob Panel - Hidden on mobile when Alice is selected */}
        <div className={`${mobileView === "bob" ? "flex" : "hidden"} md:flex flex-col min-h-0 flex-1`}>
          <UserPanel
            name="Bob"
            color="border-blue-400 dark:border-blue-600"
            keyPair={bobKeys}
            onGenerateKeys={handleBobGenerateKeys}
            onSendMessage={handleBobSendMessage}
            encryptedMessage={bobEncrypted}
            decryptedMessage={bobDecrypted}
            onDecrypt={handleBobDecrypt}
            isGenerating={bobGenerating}
            canSend={canSend}
            bothHaveKeys={bothHaveKeys}
            otherUserName="Alice"
            chatMessages={bobChatMessages}
          />
        </div>
      </div>

      {/* Footer - minimal */}
      <footer className="text-center mt-2 text-[8px] sm:text-[9px] text-muted-foreground flex-shrink-0">
        RSA-OAEP 2048-bit • Web Crypto API
      </footer>
    </div>
  );
}
