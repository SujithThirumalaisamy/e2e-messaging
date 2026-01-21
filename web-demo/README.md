# E2E Encryption Demo

An interactive visualization of end-to-end encryption using public/private key pairs.

## What it does

This demo shows how encrypted messaging works between two users (Alice & Bob):

1. **Key Generation** - Each user generates their own RSA key pair (public + private)
2. **Encryption** - Messages are encrypted using the recipient's public key
3. **Decryption** - Only the recipient can decrypt using their private key

The UI simulates two phone screens with a real-time animation showing the encryption flow. Even if someone intercepts the message in transit, they can't read it without the private key.

## Tech Stack

- Next.js + TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Web Crypto API (RSA-OAEP 2048-bit)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000
