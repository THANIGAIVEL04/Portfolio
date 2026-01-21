# STP Quick Reference Card

## 🚀 Essential Commands

### Build & Test
```powershell
# Navigate to project
cd c:\Users\THANIGAIVEL\OneDrive\Desktop\STP\reference-implementation

# Build (debug)
cargo build

# Build (release/optimized)
cargo build --release

# Run all tests
cargo test

# Run tests quietly (no warnings)
cargo test --quiet

# Run specific test
cargo test test_connection_creation

# Check without building
cargo check
```

### Run Examples
```powershell
# Run server
cargo run --example simple_server

# Run client (in another terminal)
cargo run --example simple_client

# Run reliability demo
cargo run --example reliability_demo
```

### Code Quality
```powershell
# Run linter
cargo clippy

# Format code
cargo fmt

# Check formatting
cargo fmt -- --check
```

### Documentation
```powershell
# Generate and open docs
cargo doc --open

# Generate docs only
cargo doc
```

### Maintenance
```powershell
# Clean build artifacts
cargo clean

# Update dependencies
cargo update

# Show dependency tree
cargo tree
```

---

## 📁 Project Structure

```
STP/
├── README.md              # Project overview
├── TESTING_GUIDE.md       # How to test
├── PROJECT_STATUS.md      # Current status
├── RELIABILITY_REFERENCE.md  # Reliability quick ref
├── docs/                  # Documentation
│   ├── phase4-ack-implementation.md
│   └── retransmission-implementation.md
├── reference-implementation/
│   ├── src/              # Source code
│   │   ├── lib.rs        # Main library
│   │   ├── config.rs     # Configuration
│   │   ├── error.rs      # Errors
│   │   ├── connection.rs # Connections + ACK + Retransmission
│   │   ├── endpoint.rs   # Endpoints + Driver loops
│   │   ├── stream.rs     # Streams
│   │   ├── reliability.rs # Packet tracking + RTO
│   │   ├── crypto/       # Crypto
│   │   └── packet/       # Packets + Frames
│   └── examples/         # Example code
└── .agent/workflows/     # Workflows
```

---

## 🎯 Current Status

✅ **Phase 4 Complete - Full Reliability:**
- ✅ X25519 key exchange + HKDF
- ✅ ChaCha20-Poly1305 encryption
- ✅ Stream multiplexing (bidirectional)
- ✅ Packet tracking with unique numbers
- ✅ Automatic ACK generation
- ✅ ACK processing
- ✅ RTT estimation (RFC 6298)
- ✅ **Automatic retransmission**
- ✅ **Exponential backoff**

📋 **Next Phase - Flow Control:**
- MaxData frames
- MaxStreamData frames
- Congestion control
- Connection migration

---

## 🐛 Troubleshooting

### Cargo not found
```powershell
# Restart terminal after installing Rust
```

### Build fails
```powershell
cargo clean
cargo build
```

### File locked error
```powershell
# Wait 10 seconds and retry, or:
cargo build --jobs 1
```

### Too many warnings
```powershell
# Run tests quietly
cargo test --quiet
```

---

## 📊 Key Features

**Reliability:**
- Packet tracking: Max 1000 packets
- RTO range: 10ms - 60s
- Default RTO: 100ms
- Tick interval: 10ms (100 Hz)
- Exponential backoff: 2x per retry

**Performance:**
- Memory per connection: ~100 KB
- CPU per tick: ~1-10 µs
- ACK overhead: ~16 bytes
- Retransmission overhead: Depends on loss rate

---

## 🔗 Quick Links

- **Rust Book:** https://doc.rust-lang.org/book/
- **Cargo Book:** https://doc.rust-lang.org/cargo/
- **Tokio Docs:** https://tokio.rs/
- **QUIC RFC:** https://www.rfc-editor.org/rfc/rfc9000.html
- **RFC 6298 (RTO):** https://www.rfc-editor.org/rfc/rfc6298.html

---

## 💡 Tips

1. Use `cargo check` for fast feedback during development
2. Run `cargo clippy` before committing
3. Use `cargo test --quiet` to reduce noise
4. Read warnings - they hint at what needs implementation
5. Use `cargo doc --open` to browse API docs
6. Check `RELIABILITY_REFERENCE.md` for reliability features
7. See `docs/retransmission-implementation.md` for details

---

**Last Updated:** January 4, 2026
