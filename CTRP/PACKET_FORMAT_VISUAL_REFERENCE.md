# STP Packet Format Visual Reference

**Version**: 1.0  
**Date**: January 4, 2026  
**Purpose**: Visual reference for all STP packet and frame formats

---

## Table of Contents

1. [Packet Types Overview](#1-packet-types-overview)
2. [Common Header (Long)](#2-common-header-long)
3. [Short Header (1-RTT)](#3-short-header-1-rtt)
4. [Initial Packet](#4-initial-packet)
5. [Handshake Packet](#5-handshake-packet)
6. [1-RTT Packet](#6-1-rtt-packet)
7. [Retry Packet](#7-retry-packet)
8. [Frame Formats](#8-frame-formats)
9. [Token Structure](#9-token-structure)
10. [Diagnostic Ticket](#10-diagnostic-ticket)

---

## 1. Packet Types Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      STP Packet Types                        │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Initial    │  │  Handshake   │  │    1-RTT     │  │    Retry     │
│              │  │              │  │              │  │              │
│ Type: 00     │  │ Type: 01     │  │ Type: 10     │  │ Type: 11     │
│ Long Header  │  │ Long Header  │  │ Short Header │  │ Long Header  │
│              │  │              │  │              │  │              │
│ Contains:    │  │ Contains:    │  │ Contains:    │  │ Contains:    │
│ - ClientHello│  │ - ServerHello│  │ - App Data   │  │ - Token      │
│ - 0-RTT Data │  │ - Certificate│  │ - Streams    │  │              │
│ - Token      │  │ - Finished   │  │ - ACKs       │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

---

## 2. Common Header (Long)

Used by: Initial, Handshake, Retry packets

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|1|T T|V V V|R|D|  Conn ID Len  |                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+                               +
|                                                               |
+                    Connection ID (0..160 bits)                +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Packet Number (32 bits)                  |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Field Breakdown:

Byte 0:
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ 1 │ T │ T │ V │ V │ V │ R │ D │
└───┴───┴───┴───┴───┴───┴───┴───┘
  │   │   │   │   │   │   │   │
  │   │   │   │   │   │   │   └─► Diagnostic bit (0=off, 1=on)
  │   │   │   │   │   │   └─────► Reserved (must be 0)
  │   │   │   └───┴───┴─────────► Version (001 = v1)
  │   └───┴───────────────────────► Packet Type (00/01/10/11)
  └───────────────────────────────► Header Form (1=long)

Packet Type Values:
  00 = Initial
  01 = Handshake
  10 = 1-RTT (uses short header instead)
  11 = Retry

Byte 1:
┌───────────────────────────────┐
│   Connection ID Length (8)    │  0-20 bytes
└───────────────────────────────┘

Bytes 2-N:
┌───────────────────────────────┐
│   Connection ID (variable)    │  0-160 bits (0-20 bytes)
└───────────────────────────────┘

Bytes N+1 to N+4:
┌───────────────────────────────┐
│   Packet Number (32 bits)     │  Monotonically increasing
└───────────────────────────────┘
```

---

## 3. Short Header (1-RTT)

Used by: 1-RTT packets (application data)

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|0|S|K|R R|D|  Conn ID Len  |                                   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+                                 +
|                                                               |
+                    Connection ID (0..160 bits)                +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Packet Number (32 bits)                  |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Field Breakdown:

Byte 0:
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ 0 │ S │ K │ R │ R │ D │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┘
  │   │   │   │   │   │
  │   │   │   │   │   └─────────► Diagnostic bit (0=off, 1=on)
  │   │   │   └───┴─────────────► Reserved (must be 0)
  │   │   └─────────────────────► Key Phase (0/1 for key rotation)
  │   └─────────────────────────► Spin bit (RTT measurement)
  └─────────────────────────────► Header Form (0=short)

Spin Bit:
  - Toggles once per RTT
  - Allows passive latency measurement
  - Optional (can be disabled for privacy)

Key Phase:
  - Indicates which key set is in use
  - Toggles during key update
  - Synchronized between endpoints
```

---

## 4. Initial Packet

Complete structure with payload:

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Common Header (Long)                     |
|                      (variable length)                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Token Length (16 bits)                   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                      Token (variable)                         +
|                      (0-512 bytes)                            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Payload Length (16 bits)                 |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                   Encrypted Payload (variable)                +
|                                                               |
|  Contains:                                                    |
|  - CRYPTO frame (ClientHello)                                 |
|  - STREAM frames (0-RTT data, if token present)               |
|  - PADDING frames                                             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                   Authentication Tag (16 bytes)               +
|                   (ChaCha20-Poly1305 tag)                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Token Field:
  - Empty (length=0) for first connection
  - Contains server-issued token for 0-RTT
  - See §9 for token structure

Payload Encryption:
  - Key: Initial key derived from Connection ID
  - AEAD: ChaCha20-Poly1305
  - Nonce: Packet number XOR IV
  - AAD: Packet header (unencrypted portion)
```

---

## 5. Handshake Packet

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Common Header (Long)                     |
|                      (variable length)                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Payload Length (16 bits)                 |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                   Encrypted Payload (variable)                +
|                                                               |
|  Server → Client:                                             |
|  - CRYPTO frame (ServerHello)                                 |
|  - CRYPTO frame (Certificate)                                 |
|  - CRYPTO frame (Finished)                                    |
|  - NEW_TOKEN frame (for future 0-RTT)                         |
|                                                               |
|  Client → Server:                                             |
|  - CRYPTO frame (ClientFinished)                              |
|  - CRYPTO frame (Certificate, if mutual TLS)                  |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                   Authentication Tag (16 bytes)               +
|                   (ChaCha20-Poly1305 tag)                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Payload Encryption:
  - Key: Handshake key derived from X25519 ECDHE
  - AEAD: ChaCha20-Poly1305
  - Nonce: Packet number XOR IV
  - AAD: Packet header
```

---

## 6. 1-RTT Packet

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Short Header                             |
|                      (variable length)                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                   Encrypted Payload (variable)                +
|                                                               |
|  Contains (any combination):                                  |
|  - STREAM frames (application data)                           |
|  - ACK frames (acknowledgments)                               |
|  - MAX_DATA frames (flow control)                             |
|  - MAX_STREAM_DATA frames (flow control)                      |
|  - NEW_CONNECTION_ID frames (migration)                       |
|  - PATH_CHALLENGE/RESPONSE frames (migration)                 |
|  - CONNECTION_CLOSE frames (termination)                      |
|  - DIAGNOSTIC frames (if D=1)                                 |
|  - PADDING frames                                             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                   Authentication Tag (16 bytes)               +
|                   (ChaCha20-Poly1305 tag)                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Payload Encryption:
  - Key: 1-RTT key derived from master secret
  - AEAD: ChaCha20-Poly1305
  - Nonce: Packet number XOR IV
  - AAD: Packet header
```

---

## 7. Retry Packet

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Common Header (Long)                     |
|                      (Packet Type = 11)                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Token Length (16 bits)                   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                      Retry Token (variable)                   +
|                      (64 bytes)                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                   Integrity Tag (16 bytes)                    +
|                   (HMAC-SHA256 truncated)                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Purpose:
  - Server sends Retry to validate client address
  - Prevents amplification DoS attacks
  - Client must echo token in subsequent Initial packet

Retry Token:
  - See §9 for structure
  - Server can validate without state
```

---

## 8. Frame Formats

### 8.1 PADDING Frame

```
 0
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|  Type = 0x00  |
+-+-+-+-+-+-+-+-+

Purpose: Pad packet to desired size
```

### 8.2 PING Frame

```
 0
 0 1 2 3 4 5 6 7
+-+-+-+-+-+-+-+-+
|  Type = 0x01  |
+-+-+-+-+-+-+-+-+

Purpose: Keepalive, force ACK
```

### 8.3 ACK Frame

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Type = 0x02  |         Largest Acknowledged (32)             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         ACK Delay (16)        |      ACK Range Count (16)     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      First ACK Range (32)                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                   Additional ACK Ranges (variable)            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Fields:
  - Largest Acknowledged: Highest packet number ACKed
  - ACK Delay: Time since packet received (in µs)
  - ACK Range Count: Number of additional ranges
  - First ACK Range: Contiguous range from Largest
  - Additional Ranges: Gaps and ranges (optional)

Example:
  Largest Acknowledged: 100
  First ACK Range: 5
  → ACKs packets 96-100 (5 packets)
```

### 8.4 STREAM Frame

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Type = 0x03  |                Stream ID (32)                 |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                           Offset (64)                         |
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Length (16)           |                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+                               +
|                                                               |
+                      Stream Data (variable)                   +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Stream ID Encoding:
  Bit 0: 0=client-initiated, 1=server-initiated
  Bit 1: 0=bidirectional, 1=unidirectional
  Bits 2-31: Sequential stream number
```

### 8.5 STREAM_CLOSE Frame

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Type = 0x04  |                Stream ID (32)                 |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Error Code (16)       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

### 8.6 MAX_DATA Frame

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Type = 0x05  |              Maximum Data (64)                |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Purpose: Update connection-level flow control window
```

### 8.7 MAX_STREAM_DATA Frame

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Type = 0x06  |                Stream ID (32)                 |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Maximum Stream Data (64)                   |
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Purpose: Update stream-level flow control window
```

### 8.8 CONNECTION_CLOSE Frame

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Type = 0x0B  |         Error Code (16)       |               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|      Reason Phrase Length (16)        |                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+                       +
|                                                               |
+                   Reason Phrase (variable)                    +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Error Codes:
  0x00: NO_ERROR
  0x01: PROTOCOL_VIOLATION
  0x02: CRYPTO_ERROR
  0x03: FLOW_CONTROL_ERROR
  0x04: STREAM_LIMIT_ERROR
  0x05: CONNECTION_ID_LIMIT_ERROR
```

---

## 9. Token Structure

Used for 0-RTT replay protection:

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Timestamp (64 bits)                      |
|                      (Unix time in seconds)                   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                      Client ID (128 bits)                     +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                   Server Random (128 bits)                    +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                                                               |
+                   HMAC-SHA256 (256 bits)                      +
|                   (of above fields)                           |
+                                                               +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Total Size: 64 bytes

Validation:
  1. Verify HMAC with server secret
  2. Check timestamp: current_time - timestamp < 60 seconds
  3. Check bloom filter for duplicate Server Random
  4. If valid and not duplicate: accept 0-RTT
  5. If invalid or duplicate: reject 0-RTT, continue with 1-RTT
```

---

## 10. Diagnostic Ticket

Used for controlled visibility:

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|   Version=1   |              Expiry Timestamp (64)            |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                    Connection ID (160 bits)                   +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| Visibility Lvl|                                               |
+-+-+-+-+-+-+-+-+                                               +
|                                                               |
+            Authorized Observer Public Key (256 bits)          +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                                                               +
|                                                               |
+                Server Signature (Ed25519, 512 bits)           +
|                                                               |
+                                                               +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

Total Size: 117 bytes

Visibility Levels:
  0: No visibility (default)
  1: Packet metadata (size, timing, direction)
  2: Stream IDs and frame types
  3: Decryption keys for authorized observer

Validation:
  1. Verify Ed25519 signature with server public key
  2. Check expiry timestamp
  3. Verify observer public key matches requester
  4. If valid: grant visibility level
```

---

## 11. Packet Size Examples

### Minimum Packet Sizes

```
Initial Packet (no token, minimal payload):
  - Long Header: 25 bytes (20-byte Connection ID)
  - Token Length: 2 bytes (value: 0)
  - Payload Length: 2 bytes
  - Payload: 32 bytes (minimal CRYPTO frame)
  - Auth Tag: 16 bytes
  Total: 77 bytes

1-RTT Packet (minimal):
  - Short Header: 25 bytes (20-byte Connection ID)
  - Payload: 1 byte (PING frame)
  - Auth Tag: 16 bytes
  Total: 42 bytes
```

### Maximum Packet Sizes

```
1-RTT Packet (full MTU):
  - Short Header: 25 bytes
  - Payload: 1459 bytes (MTU 1500 - IP 20 - UDP 8 - Header 25 - Tag 16)
  - Auth Tag: 16 bytes
  Total: 1500 bytes (standard Ethernet MTU)

Jumbo Frame:
  - Short Header: 25 bytes
  - Payload: 8959 bytes (MTU 9000 - IP 20 - UDP 8 - Header 25 - Tag 16)
  - Auth Tag: 16 bytes
  Total: 9000 bytes
```

---

## 12. Encryption Overhead Breakdown

```
TCP Packet:
┌────────────────────────────────────────┐
│ IP Header: 20 bytes                    │
│ TCP Header: 20 bytes                   │
│ Payload: 1460 bytes                    │
└────────────────────────────────────────┘
Total: 1500 bytes
Overhead: 40 bytes (2.7%)

QUIC Packet:
┌────────────────────────────────────────┐
│ IP Header: 20 bytes                    │
│ UDP Header: 8 bytes                    │
│ QUIC Header: ~50 bytes                 │
│ Payload: 1406 bytes                    │
│ Auth Tag: 16 bytes                     │
└────────────────────────────────────────┘
Total: 1500 bytes
Overhead: 94 bytes (6.3%)

STP Packet:
┌────────────────────────────────────────┐
│ IP Header: 20 bytes                    │
│ UDP Header: 8 bytes                    │
│ STP Header: 25 bytes                   │
│ Payload: 1431 bytes                    │
│ Auth Tag: 16 bytes                     │
└────────────────────────────────────────┘
Total: 1500 bytes
Overhead: 69 bytes (4.6%)

Comparison:
  TCP:  2.7% overhead (no encryption)
  QUIC: 6.3% overhead (encrypted)
  STP:  4.6% overhead (encrypted, optimized)
```

---

## 13. Quick Reference

### Packet Type Identification

```
First Byte Analysis:

1xxxxxxx = Long Header
  1 00 xxx xx = Initial
  1 01 xxx xx = Handshake
  1 11 xxx xx = Retry

0xxxxxxx = Short Header
  0 x x xx x = 1-RTT
```

### Frame Type Quick Reference

```
0x00: PADDING
0x01: PING
0x02: ACK
0x03: STREAM
0x04: STREAM_CLOSE
0x05: MAX_DATA
0x06: MAX_STREAM_DATA
0x07: NEW_CONNECTION_ID
0x08: RETIRE_CONNECTION_ID
0x09: PATH_CHALLENGE
0x0A: PATH_RESPONSE
0x0B: CONNECTION_CLOSE
0x0C: DIAGNOSTIC
```

### Stream ID Decoding

```
Stream ID: 0xXXXXXXXX

Bit 0: Initiator
  0 = Client-initiated
  1 = Server-initiated

Bit 1: Directionality
  0 = Bidirectional
  1 = Unidirectional

Examples:
  0x00000000 = Client bidirectional stream 0
  0x00000001 = Server bidirectional stream 0
  0x00000002 = Client unidirectional stream 0
  0x00000003 = Server unidirectional stream 0
  0x00000004 = Client bidirectional stream 1
```

---

**Document Version**: 1.0  
**Last Updated**: January 4, 2026  
**Status**: Complete
