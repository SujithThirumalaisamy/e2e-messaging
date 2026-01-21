"use client";

import { motion, AnimatePresence } from "framer-motion";

export type AnimationPhase =
  | "idle"
  | "encrypting"
  | "sending"
  | "waiting"
  | "decrypting"
  | "complete";

interface AnimationZoneProps {
  phase: AnimationPhase;
  direction: "left-to-right" | "right-to-left";
  originalMessage?: string;
  encryptedData?: string;
  senderName: string;
  receiverName: string;
}

export function AnimationZone({
  phase,
  direction,
  originalMessage,
  encryptedData,
  senderName,
  receiverName,
}: AnimationZoneProps) {
  const isLeftToRight = direction === "left-to-right";

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-3 py-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center text-muted-foreground"
          >
            <div className="text-3xl mb-2">🔒</div>
            <div className="text-xs">Generate keys & send a message</div>
          </motion.div>
        )}

        {phase === "encrypting" && (
          <motion.div
            key="encrypting"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-4xl mb-2"
            >
              🔐
            </motion.div>
            <div className="bg-amber-100 dark:bg-amber-900/50 px-3 py-1.5 rounded-lg mb-2">
              <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium">
                Encrypting with {receiverName}&apos;s PUBLIC key
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              &quot;{originalMessage}&quot;
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1 }}
              className="h-1 bg-amber-500 rounded mt-2 max-w-32"
            />
            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
              {isLeftToRight ? (
                <>
                  <span>{senderName}</span>
                  <span>→</span>
                  <span>{receiverName}</span>
                </>
              ) : (
                <>
                  <span>{receiverName}</span>
                  <span>←</span>
                  <span>{senderName}</span>
                </>
              )}
            </div>
          </motion.div>
        )}

        {phase === "sending" && (
          <motion.div
            key="sending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <div className="text-[10px] text-muted-foreground mb-4">
              Encrypted data in transit
            </div>

            <motion.div
              initial={{ x: isLeftToRight ? -40 : 40, opacity: 0 }}
              animate={{ x: isLeftToRight ? 40 : -40, opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="relative mb-4"
            >
              <span className="text-4xl">✉️</span>
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute -top-1 -right-1 text-sm"
              >
                🔒
              </motion.span>
            </motion.div>

            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="font-mono text-[7px] text-green-600 dark:text-green-400 overflow-hidden max-w-full"
            >
              {encryptedData?.substring(0, 40)}...
            </motion.div>

            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
              {isLeftToRight ? (
                <>
                  <span>{senderName}</span>
                  <span>→</span>
                  <span>{receiverName}</span>
                </>
              ) : (
                <>
                  <span>{receiverName}</span>
                  <span>←</span>
                  <span>{senderName}</span>
                </>
              )}
            </div>
          </motion.div>
        )}

        {phase === "waiting" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-4xl mb-2"
            >
              📬
            </motion.div>
            <div className="text-xs text-muted-foreground">
              Message delivered to {receiverName}
            </div>
            <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
              Waiting for decryption...
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
              {isLeftToRight ? (
                <>
                  <span>{senderName}</span>
                  <span>→</span>
                  <span>{receiverName}</span>
                </>
              ) : (
                <>
                  <span>{receiverName}</span>
                  <span>←</span>
                  <span>{senderName}</span>
                </>
              )}
            </div>
          </motion.div>
        )}

        {phase === "decrypting" && (
          <motion.div
            key="decrypting"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-4xl mb-2"
            >
              🔓
            </motion.div>
            <div className="bg-green-100 dark:bg-green-900/50 px-3 py-1.5 rounded-lg mb-2">
              <div className="text-[10px] text-green-700 dark:text-green-300 font-medium">
                Decrypting with {receiverName}&apos;s PRIVATE key
              </div>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8 }}
              className="h-1 bg-green-500 rounded mt-2 max-w-32"
            />
            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
              {isLeftToRight ? (
                <>
                  <span>{senderName}</span>
                  <span>→</span>
                  <span>{receiverName}</span>
                </>
              ) : (
                <>
                  <span>{receiverName}</span>
                  <span>←</span>
                  <span>{senderName}</span>
                </>
              )}
            </div>
          </motion.div>
        )}

        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-4xl mb-2"
            >
              ✅
            </motion.div>
            <div className="text-xs font-medium text-green-600 dark:text-green-400">
              Decrypted successfully!
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              Only {receiverName} could read this
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
              {isLeftToRight ? (
                <>
                  <span>{senderName}</span>
                  <span>→</span>
                  <span>{receiverName}</span>
                </>
              ) : (
                <>
                  <span>{receiverName}</span>
                  <span>←</span>
                  <span>{senderName}</span>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
