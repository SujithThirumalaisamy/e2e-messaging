#!/bin/bash
# Decrypt a message using your private key

INPUT="${1:-messages/encrypted.bin}"
OUTPUT="${2:-messages/decrypted.txt}"

openssl pkeyutl -decrypt \
  -inkey keys/private.pem \
  -in "$INPUT" \
  -out "$OUTPUT"

echo "Decrypted: $INPUT -> $OUTPUT"
cat "$OUTPUT"
