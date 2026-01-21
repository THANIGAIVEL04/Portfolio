# STP Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         STP PROTOCOL                             │
│                  (Secure Transport Protocol)                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐                                    ┌──────────────┐
│              │                                    │              │
│    CLIENT    │                                    │    SERVER    │
│              │                                    │              │
└──────┬───────┘                                    └──────┬───────┘
       │                                                   │
       │  ┌─────────────────────────────────────────┐    │
       │  │         HANDSHAKE PHASE                 │    │
       │  └─────────────────────────────────────────┘    │
       │                                                   │
       │  1. CLIENT_HELLO (PacketType::ClientHello)       │
       │ ─────────────────────────────────────────────────>
       │                                                   │
       │                                    Initialize     │
       │                                    CryptoContext  │
       │                                                   │
       │  2. SERVER_HELLO (PacketType::ServerHello)       │
       │ <─────────────────────────────────────────────────
       │                                                   │
       │  Initialize                                       │
       │  CryptoContext                                    │
       │                                                   │
       │  ┌─────────────────────────────────────────┐    │
       │  │      ENCRYPTED DATA PHASE               │    │
       │  └─────────────────────────────────────────┘    │
       │                                                   │
       │  3. ENCRYPTED_DATA (PacketType::EncryptedData)   │
       │     [nonce:12][ciphertext:n]                     │
       │ ─────────────────────────────────────────────────>
       │                                                   │
       │                                    Decrypt &      │
       │                                    Process        │
       │                                    Update Flow    │
       │                                    Control        │
       │                                                   │
       │  4. ENCRYPTED_DATA (ACK)                         │
       │     [nonce:12][ciphertext:n]                     │
       │ <─────────────────────────────────────────────────
       │                                                   │
       │  Decrypt ACK                                      │
       │  Update Flow Control                              │
       │                                                   │
       └───────────────────────────────────────────────────┘
```

## Module Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                           main.rs                                │
│                      (Entry Point & CLI)                         │
└────────┬────────────────────────────────────────────────────────┘
         │
         ├─────────────────────────────────────────────────────────┐
         │                                                          │
         v                                                          v
┌─────────────────┐                                    ┌─────────────────┐
│   net::udp      │                                    │   net::udp      │
│   run_server()  │                                    │   run_client()  │
└────────┬────────┘                                    └────────┬────────┘
         │                                                       │
         │  Uses                                                 │  Uses
         │                                                       │
         ├───────────────────────────────────────────────────────┤
         │                                                       │
         v                                                       v
┌─────────────────────────────────────────────────────────────────┐
│                      packet::packet                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ PacketType { ClientHello, ServerHello, EncryptedData }   │  │
│  │ Packet { packet_type, payload }                          │  │
│  │ encode() -> Vec<u8>                                       │  │
│  │ decode(data) -> Option<Packet>                           │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │                                                       │
         │  Uses                                                 │  Uses
         │                                                       │
         v                                                       v
┌─────────────────────────────────────────────────────────────────┐
│                   handshake::handshake                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ create_client_hello() -> Packet                          │  │
│  │ create_server_hello() -> Packet                          │  │
│  │ is_client_hello(packet) -> bool                          │  │
│  │ is_server_hello(packet) -> bool                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │                                                       │
         │  Uses                                                 │  Uses
         │                                                       │
         v                                                       v
┌─────────────────────────────────────────────────────────────────┐
│                     crypto::crypto                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ CryptoContext { cipher: Aes256Gcm }                      │  │
│  │ new(key: &[u8; 32]) -> Self                              │  │
│  │ encrypt(plaintext) -> Vec<u8>  [nonce||ciphertext]       │  │
│  │ decrypt(data) -> Option<Vec<u8>>                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │                                                       │
         │  Uses                                                 │  Uses
         │                                                       │
         v                                                       v
┌─────────────────────────────────────────────────────────────────┐
│                  transport::flow_control                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ FlowControl { recv_window, send_window_used }            │  │
│  │ new(initial_window) -> Self                              │  │
│  │ can_send(bytes) -> bool                                  │  │
│  │ on_send(bytes)                                           │  │
│  │ on_ack(bytes)                                            │  │
│  │ available_window() -> usize                              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Packet Wire Format

```
┌────────────────────────────────────────────────────────────┐
│                    STP PACKET FORMAT                        │
└────────────────────────────────────────────────────────────┘

Byte:    0          1          2          3 ...        N
       ┌──────────┬──────────┬──────────┬──────────────────┐
       │   Type   │  Length  │  Length  │     Payload      │
       │  1 byte  │ (MSB)    │ (LSB)    │  Variable (0-N)  │
       │          │ 1 byte   │ 1 byte   │                  │
       └──────────┴──────────┴──────────┴──────────────────┘

Type Values:
  1 = ClientHello   (Handshake initiation)
  2 = ServerHello   (Handshake response)
  3 = EncryptedData (Encrypted application data)

Length: Big-endian u16 (0-65535 bytes)

Payload: Variable length data
  - For ClientHello: "CLIENT_HELLO" (UTF-8)
  - For ServerHello: "SERVER_HELLO" (UTF-8)
  - For EncryptedData: [nonce:12][ciphertext:n]
```

## Encrypted Payload Format

```
┌────────────────────────────────────────────────────────────┐
│              ENCRYPTED DATA PAYLOAD FORMAT                  │
└────────────────────────────────────────────────────────────┘

Byte:    0 ...      11         12 ...                     N
       ┌──────────────────────┬──────────────────────────────┐
       │       Nonce          │       Ciphertext             │
       │     12 bytes         │     Variable (N bytes)       │
       │   (Random, unique)   │  (AES-GCM encrypted data)    │
       └──────────────────────┴──────────────────────────────┘

Nonce: 
  - 12 bytes (96 bits)
  - Randomly generated for each encryption
  - Required for AES-GCM decryption
  - MUST be unique per message

Ciphertext:
  - AES-256-GCM encrypted data
  - Includes authentication tag (16 bytes)
  - Provides confidentiality AND integrity
  - Cannot be decrypted without correct key and nonce
```

## State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT STATE MACHINE                      │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │ UNINITIALIZED│
    └──────┬───────┘
           │
           │ Send CLIENT_HELLO
           v
    ┌──────────────────┐
    │ HANDSHAKE_SENT   │
    └──────┬───────────┘
           │
           │ Receive SERVER_HELLO
           │ Initialize CryptoContext
           v
    ┌──────────────────┐
    │ HANDSHAKE_COMPLETE│
    └──────┬───────────┘
           │
           │ Ready to send encrypted data
           v
    ┌──────────────────┐
    │ ACTIVE           │◄─────┐
    │ (Sending Data)   │      │
    └──────┬───────────┘      │
           │                  │
           │ Send ENCRYPTED_DATA
           │ Receive ACK      │
           └──────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                    SERVER STATE MACHINE                      │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │ LISTENING    │◄─────────────────┐
    └──────┬───────┘                  │
           │                          │
           │ Receive CLIENT_HELLO     │
           │ Initialize CryptoContext │
           │ Send SERVER_HELLO        │
           v                          │
    ┌──────────────────┐              │
    │ HANDSHAKE_COMPLETE│              │
    └──────┬───────────┘              │
           │                          │
           │ Ready to receive data    │
           v                          │
    ┌──────────────────┐              │
    │ ACTIVE           │              │
    │ (Receiving Data) │              │
    └──────┬───────────┘              │
           │                          │
           │ Receive ENCRYPTED_DATA   │
           │ Decrypt & Process        │
           │ Send ENCRYPTED_DATA (ACK)│
           └──────────────────────────┘
```

## Flow Control Mechanism

```
┌─────────────────────────────────────────────────────────────┐
│                   FLOW CONTROL WINDOW                        │
└─────────────────────────────────────────────────────────────┘

Initial State:
┌────────────────────────────────────────────────────────────┐
│                    Available: 65536 bytes                   │
│                    Used: 0 bytes                            │
└────────────────────────────────────────────────────────────┘

After Sending 100 bytes:
┌────────────────────────────────────────────────────────────┐
│ Used: 100 │          Available: 65436 bytes                │
└────────────────────────────────────────────────────────────┘

After Sending 200 more bytes:
┌────────────────────────────────────────────────────────────┐
│ Used: 300 │          Available: 65236 bytes                │
└────────────────────────────────────────────────────────────┘

After Receiving ACK for 100 bytes:
┌────────────────────────────────────────────────────────────┐
│ Used: 200 │          Available: 65336 bytes                │
└────────────────────────────────────────────────────────────┘

Window Exhausted (cannot send):
┌────────────────────────────────────────────────────────────┐
│                    Used: 65536 bytes                        │
│                    Available: 0 bytes                       │
│                    ⚠️  BLOCKED - Wait for ACK               │
└────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
└─────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Layer 4: Application Data                                  │
│ "Hello from STP client!"                                   │
└────────────────────────────────────────────────────────────┘
                         │
                         │ encrypt()
                         v
┌────────────────────────────────────────────────────────────┐
│ Layer 3: AES-256-GCM Encryption                            │
│ [nonce:12][ciphertext + auth_tag:n+16]                     │
│ ✓ Confidentiality (AES-256)                                │
│ ✓ Integrity (GCM authentication)                           │
│ ✓ Unique nonce per message                                 │
└────────────────────────────────────────────────────────────┘
                         │
                         │ Packet.encode()
                         v
┌────────────────────────────────────────────────────────────┐
│ Layer 2: STP Packet Framing                                │
│ [type:1][length:2][payload:n]                              │
│ ✓ Type safety (PacketType enum)                            │
│ ✓ Length validation                                        │
└────────────────────────────────────────────────────────────┘
                         │
                         │ UDP send
                         v
┌────────────────────────────────────────────────────────────┐
│ Layer 1: UDP Transport                                     │
│ [IP Header][UDP Header][STP Packet]                        │
└────────────────────────────────────────────────────────────┘
```

## Dependencies

```
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL DEPENDENCIES                     │
└─────────────────────────────────────────────────────────────┘

aes-gcm = "0.10"
├── Provides: AES-256-GCM encryption
├── Used by: crypto::crypto::CryptoContext
└── Purpose: Authenticated encryption (AEAD)

rand = "0.8"
├── Provides: Random number generation
├── Used by: crypto::crypto::CryptoContext
└── Purpose: Nonce generation for encryption

std::net::UdpSocket
├── Provides: UDP networking
├── Used by: net::udp::{run_server, run_client}
└── Purpose: Transport layer
```

---

## Summary

This architecture demonstrates:

1. **Layered Design**: Clear separation between transport, protocol, crypto, and application
2. **Type Safety**: Rust's type system ensures protocol correctness
3. **Security**: AES-256-GCM provides confidentiality and integrity
4. **Flow Control**: Prevents sender from overwhelming receiver
5. **Simplicity**: Academic-focused, demonstrable implementation

All components are **fully implemented**, **properly wired**, and **demonstrably functional**.
