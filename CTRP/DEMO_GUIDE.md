# STP Demo Quick Start Guide

## Prerequisites
- Rust toolchain installed
- Two terminal windows

## Running the Demo

### Terminal 1: Start the Server

```bash
cd C:\Users\THANIGAIVEL\OneDrive\Desktop\STP
cargo run -- server
```

**What to expect:**
- Server starts listening on `127.0.0.1:9000`
- Waits for client connection
- Displays handshake messages
- Shows decrypted messages from client
- Displays flow control status

### Terminal 2: Run the Client

```bash
cd C:\Users\THANIGAIVEL\OneDrive\Desktop\STP
cargo run -- client
```

**What to expect:**
- Client initiates handshake
- Sends 3 encrypted messages
- Receives encrypted acknowledgments
- Shows flow control status
- Completes and exits

## Expected Output

### Server Output
```
[STP SERVER] Listening on 127.0.0.1:9000
[STP SERVER] ========================================
[STP SERVER] Received CLIENT_HELLO from 127.0.0.1:xxxxx
[STP SERVER] Crypto context initialized
[STP SERVER] Sent SERVER_HELLO to 127.0.0.1:xxxxx
[STP SERVER] Handshake complete - ready for encrypted data
[STP SERVER] Flow control window: 65536 bytes
[STP SERVER] Received encrypted packet (XX bytes)
[STP SERVER] ✓ Decrypted message: "Hello from STP client!"
[STP SERVER] Flow control: XXXX bytes remaining
[STP SERVER] Sent encrypted acknowledgment
[STP SERVER] Received encrypted packet (XX bytes)
[STP SERVER] ✓ Decrypted message: "This is encrypted data transfer"
[STP SERVER] Flow control: XXXX bytes remaining
[STP SERVER] Sent encrypted acknowledgment
[STP SERVER] Received encrypted packet (XX bytes)
[STP SERVER] ✓ Decrypted message: "STP protocol demonstration"
[STP SERVER] Flow control: XXXX bytes remaining
[STP SERVER] Sent encrypted acknowledgment
```

### Client Output
```
[STP CLIENT] ========================================
[STP CLIENT] Starting STP client demo
[STP CLIENT] ========================================
[STP CLIENT] Step 1: Initiating handshake...
[STP CLIENT] Sent CLIENT_HELLO
[STP CLIENT] Received SERVER_HELLO
[STP CLIENT] Crypto context initialized
[STP CLIENT] ✓ Handshake complete

[STP CLIENT] Step 2: Sending encrypted data...

[STP CLIENT] Message 1: "Hello from STP client!"
[STP CLIENT] Encrypted: XX bytes
[STP CLIENT] Sent encrypted packet
[STP CLIENT] Flow control: XXXX bytes remaining
[STP CLIENT] ✓ Server response: "ACK: Received 'Hello from STP client!' (XX bytes)"

[STP CLIENT] Message 2: "This is encrypted data transfer"
[STP CLIENT] Encrypted: XX bytes
[STP CLIENT] Sent encrypted packet
[STP CLIENT] Flow control: XXXX bytes remaining
[STP CLIENT] ✓ Server response: "ACK: Received 'This is encrypted data transfer' (XX bytes)"

[STP CLIENT] Message 3: "STP protocol demonstration"
[STP CLIENT] Encrypted: XX bytes
[STP CLIENT] Sent encrypted packet
[STP CLIENT] Flow control: XXXX bytes remaining
[STP CLIENT] ✓ Server response: "ACK: Received 'STP protocol demonstration' (XX bytes)"

[STP CLIENT] ========================================
[STP CLIENT] Demo complete - all messages sent
[STP CLIENT] ========================================
```

## What the Demo Shows

### 1. Handshake Protocol ✅
- Client sends CLIENT_HELLO
- Server responds with SERVER_HELLO
- Both sides initialize encryption

### 2. Encrypted Communication ✅
- All data encrypted with AES-256-GCM
- Unique nonce for each message
- Authenticated encryption (integrity + confidentiality)

### 3. Flow Control ✅
- 64KB initial window
- Window decreases as data is sent
- Window increases as data is acknowledged
- Prevents sender from overwhelming receiver

### 4. Packet Protocol ✅
- All messages use packet framing
- Type-safe packet types
- Proper encoding/decoding

## Troubleshooting

### "Address already in use"
- Another instance of the server is running
- Kill the existing process or wait a moment

### "Connection timeout"
- Make sure server is running first
- Check firewall settings

### Build errors
- Run `cargo clean` then `cargo build`
- Ensure Rust toolchain is up to date

## Building for Production

```bash
# Clean build
cargo clean

# Release build (optimized)
cargo build --release

# Run release build
./target/release/STP server
./target/release/STP client
```

## Code Structure

```
src/
├── main.rs              # Entry point
├── packet/              # Packet encoding/decoding
├── handshake/           # Handshake protocol
├── crypto/              # AES-GCM encryption
├── transport/           # Flow control
└── net/                 # UDP client/server
```

## Key Features Demonstrated

1. **Security**: AES-256-GCM encryption
2. **Reliability**: Acknowledgment-based communication
3. **Flow Control**: Sliding window mechanism
4. **Protocol Design**: Clear handshake and data phases
5. **Error Handling**: Safe Rust error handling

## Academic Notes

This is a **demonstration implementation** with the following simplifications:

- **Fixed session key**: In production, use key exchange (X25519)
- **Single connection**: In production, support multiple connections
- **No retransmission**: In production, implement timeout and retransmit
- **Simple flow control**: In production, use congestion control

These simplifications are **intentional** to focus the demo on core protocol concepts.
