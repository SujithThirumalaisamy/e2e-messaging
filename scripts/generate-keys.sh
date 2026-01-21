#!/bin/bash
# Generate RSA key pair for E2E encryption

echo "Generating RSA key pair..."

# Generate private key
openssl genpkey -algorithm RSA -out keys/private.pem -pkeyopt rsa_keygen_bits:2048

# Extract public key from private key
openssl rsa -pubout -in keys/private.pem -out keys/public.pem

echo "Keys generated in keys/ folder"
echo "  - private.pem (keep this SECRET!)"
echo "  - public.pem (share this with others)"
