"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { KeyPair } from "@/lib/crypto";

export interface ChatMessage {
  type: "sent" | "received" | "system";
  content: string;
  encrypted?: string;
}

interface UserPanelProps {
  name: string;
  color: string;
  keyPair: KeyPair | null;
  onGenerateKeys: () => Promise<void>;
  onSendMessage?: (message: string) => void;
  encryptedMessage?: string;
  decryptedMessage?: string;
  onDecrypt?: () => void;
  isGenerating: boolean;
  canSend: boolean;
  bothHaveKeys: boolean;
  otherUserName: string;
  chatMessages?: ChatMessage[];
}

export function UserPanel({
  name,
  color,
  keyPair,
  onGenerateKeys,
  onSendMessage,
  encryptedMessage,
  decryptedMessage,
  onDecrypt,
  isGenerating,
  canSend,
  bothHaveKeys,
  otherUserName,
  chatMessages = [],
}: UserPanelProps) {
  const [message, setMessage] = useState("");
  const [showKeys, setShowKeys] = useState(false);
  const [copiedKey, setCopiedKey] = useState<"public" | "private" | null>(null);

  const handleSend = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const copyToClipboard = async (text: string, type: "public" | "private") => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const truncateKey = (key: string) => {
    const lines = key.split("\n");
    if (lines.length > 3) {
      return (
        lines[0] +
        "\n" +
        lines[1].substring(0, 16) +
        "..." +
        "\n" +
        lines[lines.length - 1]
      );
    }
    return key;
  };

  return (
    <div
      className={`w-full border-2 rounded-xl ${color} flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-900`}
    >
      {/* Phone-style header */}
      <div className="p-2 sm:p-3 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm sm:text-base">
            {name === "Alice" ? "👩" : "👨"}
          </div>
          <div>
            <div className="text-sm font-semibold">{name}</div>
            <div className="text-[9px] sm:text-[10px] text-muted-foreground">
              {keyPair ? "🟢 Keys ready" : "⚪ No keys"}
            </div>
          </div>
        </div>
      </div>

      {/* Key Generation & Keys Section */}
      <div className="p-2 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0 space-y-2">
        <Button
          onClick={onGenerateKeys}
          disabled={isGenerating}
          className="w-full text-xs sm:text-sm"
          size="sm"
          variant={keyPair ? "outline" : "default"}
        >
          {isGenerating ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mr-2"
            >
              🔄
            </motion.span>
          ) : null}
          {isGenerating
            ? "Generating..."
            : keyPair
              ? "Regenerate Keys"
              : "Generate Key Pair"}
        </Button>

        {/* Collapsible Keys */}
        {keyPair && (
          <div className="border border-zinc-200 dark:border-zinc-700 rounded-md overflow-hidden">
            <button
              onClick={() => setShowKeys(!showKeys)}
              className="w-full px-2 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <span>🔑 Show Keys</span>
              <motion.span
                animate={{ rotate: showKeys ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-[10px]"
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {showKeys && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-2 space-y-2 border-t border-zinc-200 dark:border-zinc-700">
                    {/* Public Key */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] sm:text-[10px] font-medium text-green-600 dark:text-green-400">
                          🔓 Public Key
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 px-1.5 text-[9px] sm:text-[10px]"
                          onClick={() =>
                            copyToClipboard(keyPair.publicKeyPem, "public")
                          }
                        >
                          {copiedKey === "public" ? "✓" : "Copy"}
                        </Button>
                      </div>
                      <pre className="text-[7px] sm:text-[8px] bg-green-50 dark:bg-green-950/50 p-1.5 rounded font-mono leading-tight overflow-hidden">
                        {truncateKey(keyPair.publicKeyPem)}
                      </pre>
                    </div>

                    {/* Private Key */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] sm:text-[10px] font-medium text-red-600 dark:text-red-400">
                          🔐 Private Key
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 px-1.5 text-[9px] sm:text-[10px]"
                          onClick={() =>
                            copyToClipboard(keyPair.privateKeyPem, "private")
                          }
                        >
                          {copiedKey === "private" ? "✓" : "Copy"}
                        </Button>
                      </div>
                      <pre className="text-[7px] sm:text-[8px] bg-red-50 dark:bg-red-950/50 p-1.5 rounded font-mono leading-tight overflow-hidden">
                        {truncateKey(keyPair.privateKeyPem)}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Chat Area - This MUST grow to fill space */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-2 bg-zinc-50 dark:bg-zinc-900/50">
        {/* Chat messages */}
        {chatMessages.map((msg, i) => (
          <div key={i}>
            {/* System message (key change notification) */}
            {msg.type === "system" && (
              <div className="flex justify-center my-2">
                <div className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700">
                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-amber-700 dark:text-amber-300">
                    <span>🔐</span>
                    <span>{msg.content}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sent message (right aligned) */}
            {msg.type === "sent" && (
              <div className="flex justify-end">
                <div className="max-w-[85%] px-2.5 py-1.5 rounded-2xl rounded-br-sm bg-blue-500 text-white text-[11px] sm:text-xs">
                  {msg.content}
                </div>
              </div>
            )}

            {/* Received message (left aligned) */}
            {msg.type === "received" && (
              <div className="flex justify-start">
                <div className="max-w-[85%] px-2.5 py-1.5 rounded-2xl rounded-bl-sm bg-zinc-200 dark:bg-zinc-700 text-[11px] sm:text-xs">
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Received encrypted message (left aligned) */}
        <AnimatePresence>
          {encryptedMessage && !decryptedMessage && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-amber-100 dark:bg-amber-900/50 border border-amber-300 dark:border-amber-700 overflow-hidden">
                <div className="px-2 py-1.5">
                  <div className="text-[9px] sm:text-[10px] text-amber-700 dark:text-amber-300 font-medium mb-1">
                    🔒 Encrypted
                  </div>
                  <div className="font-mono text-[7px] sm:text-[8px] text-amber-800 dark:text-amber-200 break-all leading-tight">
                    {encryptedMessage.substring(0, 50)}...
                  </div>
                </div>
                <Button
                  onClick={onDecrypt}
                  size="sm"
                  className="w-full rounded-none rounded-b-xl h-6 sm:h-7 text-[9px] sm:text-[10px] bg-amber-500 hover:bg-amber-600 text-white"
                >
                  🔓 Decrypt
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {chatMessages.length === 0 &&
          !encryptedMessage &&
          !decryptedMessage && (
            <div className="h-full flex items-center justify-center text-[9px] sm:text-[10px] text-muted-foreground">
              No messages yet
            </div>
          )}
      </div>

      {/* Message Input - ALWAYS at bottom */}
      {onSendMessage && (
        <div className="p-2 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Message ${otherUserName}...`}
              className="flex-1 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs border border-zinc-300 dark:border-zinc-600 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-400 bg-zinc-100 dark:bg-zinc-800"
              disabled={!canSend}
            />
            <Button
              onClick={handleSend}
              disabled={!canSend || !message.trim()}
              size="sm"
              className="rounded-full w-7 h-7 sm:w-8 sm:h-8 p-0 flex-shrink-0"
            >
              ↑
            </Button>
          </div>
          {!bothHaveKeys && (
            <p className="text-[8px] sm:text-[9px] text-muted-foreground mt-1 text-center">
              Both need keys first
            </p>
          )}
        </div>
      )}
    </div>
  );
}
