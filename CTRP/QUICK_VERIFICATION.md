# STP Quick Verification Guide

## Quick Test Commands

### 1. Clean Build
```bash
cargo clean
cargo build
```

### 2. Run Server (Terminal 1)
```bash
cargo run -- server
```

### 3. Run Client (Terminal 2)
```bash
cargo run -- client
```

## Expected Behavior

### Server Output Should Show:
1. ✅ Server listening on 127.0.0.1:9000
2. ✅ Received CLIENT_HELLO
3. ✅ Crypto context initialized
4. ✅ Sent SERVER_HELLO
5. ✅ Handshake complete
6. ✅ Received encrypted packets
7. ✅ Decrypted messages displayed
8. ✅ Flow control window updates
9. ✅ Sent encrypted acknowledgments

### Client Output Should Show:
1. ✅ Starting STP client demo
2. ✅ Sent CLIENT_HELLO
3. ✅ Received SERVER_HELLO
4. ✅ Handshake complete
5. ✅ Sending encrypted data
6. ✅ Multiple messages encrypted and sent
7. ✅ Flow control window updates
8. ✅ Server acknowledgments received and decrypted
9. ✅ Demo complete

## Verification Checklist

- [ ] Project builds without errors
- [ ] Server starts successfully
- [ ] Client completes handshake
- [ ] Encrypted data is transmitted
- [ ] Server decrypts messages correctly
- [ ] Flow control is enforced
- [ ] Acknowledgments are sent and received
- [ ] No panics or crashes
- [ ] Clear protocol stage logging

## Common Issues

### Issue: "Address already in use"
**Solution**: Kill any existing server process on port 9000

### Issue: "Connection timeout"
**Solution**: Ensure server is running before starting client

### Issue: "Decryption failed"
**Solution**: Verify both client and server use same DEMO_SESSION_KEY

## Success Criteria

✅ **PASS**: All messages encrypted, transmitted, decrypted, and acknowledged
✅ **PASS**: Flow control window updates correctly
✅ **PASS**: No errors or panics
✅ **PASS**: Clear demonstration of protocol stages

## Academic Demonstration

This implementation demonstrates:
1. **Handshake Protocol**: CLIENT_HELLO / SERVER_HELLO
2. **Encryption**: AES-256-GCM authenticated encryption
3. **Flow Control**: Sliding window mechanism
4. **Packet Framing**: TLV (Type-Length-Value) format
5. **Error Handling**: Graceful failure handling
6. **State Management**: Clear protocol phases

**Status**: ✅ READY FOR ACADEMIC SUBMISSION
