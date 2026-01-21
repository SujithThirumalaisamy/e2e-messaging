# E2E Encrypted Messenger Demo

A demonstration of end-to-end encryption using RSA public/private key pairs.

## How E2E Encryption Works

```
┌─────────────┐                              ┌─────────────┐
│    ALICE    │                              │     BOB     │
├─────────────┤                              ├─────────────┤
│ Private Key │                              │ Private Key │
│ Public Key  │ ──── shares public key ────> │ Public Key  │
└─────────────┘                              └─────────────┘

When Alice wants to send a secret message to Bob:

1. Alice encrypts message using BOB'S PUBLIC key
2. Encrypted message travels over the internet (unreadable to anyone)
3. Bob decrypts using HIS PRIVATE key (only he has this!)

Even if someone intercepts the encrypted message, they CAN'T read it
without Bob's private key.
```

## Interactive Web Demo

The best way to understand E2E encryption is to **see it in action**:

```bash
cd web-demo
npm install
npm run dev
```

Then open http://localhost:3000 to:

- Generate key pairs for Alice and Bob with one click
- Send encrypted messages between them
- Watch the encryption/decryption animation in real-time

## Command Line Demo

For a hands-on terminal experience:

```bash
# 1. Generate your key pair
./scripts/generate-keys.sh

# 2. Write a message
echo "Hello, this is secret!" > messages/message.txt

# 3. Encrypt it (using recipient's public key)
./scripts/encrypt.sh

# 4. Decrypt it (recipient uses their private key)
./scripts/decrypt.sh
```

## Key Concepts

| Term            | What it does                                            |
| --------------- | ------------------------------------------------------- |
| **Public Key**  | Share freely. Others use it to encrypt messages TO you  |
| **Private Key** | Keep SECRET! You use it to decrypt messages sent to you |
| **Encrypt**     | Turn readable text into scrambled data                  |
| **Decrypt**     | Turn scrambled data back into readable text             |

## Notes

- Never commit or share `private.pem` files
- Public keys are safe to share
- This demo uses RSA-OAEP (2048-bit) encryption
- Real messengers (Signal, WhatsApp) use hybrid encryption for better efficiency
