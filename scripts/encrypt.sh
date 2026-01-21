#!/bin/bash
# Encrypt a message using recipient's public key

INPUT="${1:-messages/message.txt}"
OUTPUT="${2:-messages/encrypted.bin}"

openssl pkeyutl -encrypt \
  -pubin \
  -inkey keys/public.pem \
  -in "$INPUT" \
  -out "$OUTPUT"

echo "Encrypted: $INPUT -> $OUTPUT"
