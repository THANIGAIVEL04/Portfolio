# STP Reliability Quick Reference

## Packet Tracking

### Sent Packets
```rust
// Automatic packet number assignment
let packet_number = self.packet_tracker.next_packet_number();

// Track sent packet for retransmission
self.packet_tracker.track_sent(packet_number, bytes.clone());
```

### Received Packets
```rust
// Track received packet for ACK generation
self.track_received_packet(header.packet_number);
```

## ACK Handling

### Generating ACKs
```rust
// Automatically called in poll_outgoing()
if let Some(ack_frame) = self.generate_ack_frame() {
    frames.push(AnyFrame::Ack(ack_frame));
}
```

### Processing ACKs
```rust
// Automatically called when AckFrame is received
AnyFrame::Ack(ack_frame) => {
    self.process_ack_frame(ack_frame)?;
}
```

## RTT and RTO

### Current RTO
```rust
let rto = self.packet_tracker.rto();
```

### Checking for Retransmissions
```rust
let to_retransmit = self.packet_tracker.check_retransmissions();
for packet_number in to_retransmit {
    if let Some(data) = self.packet_tracker.get_packet_data(packet_number) {
        // Resend packet
        self.packet_tracker.mark_for_retransmit(packet_number);
    }
}
```

## Key Data Structures

### AckFrame (Simplified)
```rust
pub struct AckFrame {
    pub largest_acknowledged: u64,
    pub delay: u64,
    pub first_ack_range: u64,
}
```

### AckRange
```rust
pub struct AckRange {
    pub start: u64,  // Inclusive
    pub end: u64,    // Inclusive
}
```

### PacketTracker
```rust
pub struct PacketTracker {
    sent_packets: BTreeMap<u64, SentPacket>,
    next_packet_number: u64,
    largest_acked: Option<u64>,
    rto: Duration,
    srtt: Option<Duration>,
    rttvar: Duration,
}
```

## Configuration Constants

```rust
// Reliability module (src/reliability.rs)
const MAX_TRACKED_PACKETS: usize = 1000;
const DEFAULT_RTO: Duration = Duration::from_millis(100);
const MAX_RTO: Duration = Duration::from_secs(60);
const MIN_RTO: Duration = Duration::from_millis(10);

// Connection module (src/connection.rs)
const MAX_RECEIVED_PACKETS: usize = 1000;
const RECEIVED_PACKET_PRUNE_SIZE: usize = 500;
```

## Workflow

### Sending Data with ACKs
1. Application calls `stream.write(data)`
2. Data queued in stream's send channel
3. `Connection::poll_outgoing()` called periodically
4. ACK frame generated if packets received
5. Data frames collected from streams
6. Frames bundled into `OneRttPacket`
7. Packet number assigned
8. Packet encrypted and sent
9. Packet tracked for retransmission

### Receiving Data and Sending ACKs
1. Encrypted packet arrives
2. `Connection::handle_packet()` called
3. Packet decrypted
4. Packet number tracked for ACK
5. Frames processed:
   - `StreamFrame`: Data delivered to stream
   - `AckFrame`: Sent packets marked as acked
6. Next `poll_outgoing()` includes ACK frame

## Debugging

### Check Unacked Packets
```rust
let unacked = self.packet_tracker.unacked_count();
println!("Unacked packets: {}", unacked);
```

### Check Largest Acked
```rust
if let Some(largest) = self.packet_tracker.largest_acked() {
    println!("Largest acked: {}", largest);
}
```

### Monitor RTT
```rust
let rto = self.packet_tracker.rto();
println!("Current RTO: {:?}", rto);
```
