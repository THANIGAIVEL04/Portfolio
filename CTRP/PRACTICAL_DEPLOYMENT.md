# 🔧 PRACTICAL DEPLOYMENT EXAMPLES

## Quick Reference: Making STP Work on Real Networks

---

## 📍 CURRENT STATE vs PRODUCTION STATE

### **Current (Academic Demo)**
```rust
// src/net/udp.rs - Line 40
pub const SERVER_ADDR: &str = "127.0.0.1:9000";  // Localhost only
```
- ✅ Works on: Same computer only
- ❌ Doesn't work on: Different computers, networks, internet

### **Production (Real Network)**
```rust
// src/net/udp.rs - Modified
pub const SERVER_ADDR: &str = "0.0.0.0:9000";  // All interfaces
```
- ✅ Works on: Any computer that can reach the server
- ✅ Works on: LAN, WAN, Internet

---

## 🎯 SCENARIO 1: Two Computers in Same Room (LAN)

### **Setup:**
- Computer A (Server): 192.168.1.100
- Computer B (Client): 192.168.1.101
- Both connected to same WiFi/Router

### **Step-by-Step:**

#### **1. On Server Computer (Computer A):**

**Modify `src/net/udp.rs`:**
```rust
// Change line 40 from:
pub const SERVER_ADDR: &str = "127.0.0.1:9000";

// To:
pub const SERVER_ADDR: &str = "0.0.0.0:9000";
```

**Build and run:**
```bash
cd C:\Users\THANIGAIVEL\OneDrive\Desktop\STP
cargo build --release
cargo run --release -- server
```

**Configure Windows Firewall:**
```powershell
# Open PowerShell as Administrator
New-NetFirewallRule -DisplayName "STP Server" -Direction Inbound -Protocol UDP -LocalPort 9000 -Action Allow
```

#### **2. On Client Computer (Computer B):**

**Copy the entire STP folder to Computer B**

**Modify `src/net/udp.rs`:**
```rust
// Change line 40 from:
pub const SERVER_ADDR: &str = "127.0.0.1:9000";

// To (use Server's IP):
pub const SERVER_ADDR: &str = "192.168.1.100:9000";
```

**Build and run:**
```bash
cargo build --release
cargo run --release -- client
```

### **Expected Result:**
```
[STP CLIENT] Starting STP client demo
[STP CLIENT] Sent CLIENT_HELLO
[STP CLIENT] Received SERVER_HELLO
[STP CLIENT] ✓ Handshake complete
[STP CLIENT] Sending encrypted data...
```

---

## 🌐 SCENARIO 2: Cloud Server (AWS/Azure/GCP)

### **Setup:**
- Cloud Server: Public IP 54.123.45.67
- Your Computer: Anywhere with internet

### **Step-by-Step:**

#### **1. Launch Cloud Server:**

**AWS EC2 Example:**
```bash
# 1. Go to AWS Console
# 2. Launch EC2 Instance
#    - AMI: Ubuntu Server 22.04 LTS
#    - Instance Type: t2.micro (free tier)
#    - Security Group: Create new
#      - Type: Custom UDP
#      - Port: 9000
#      - Source: 0.0.0.0/0 (anywhere)
# 3. Launch and note the public IP
```

#### **2. Install Rust on Cloud Server:**
```bash
# SSH into your server
ssh -i your-key.pem ubuntu@54.123.45.67

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Verify installation
rustc --version
```

#### **3. Upload STP Code:**

**Option A: Using SCP (from your computer):**
```bash
# Compress the folder
tar -czf STP.tar.gz STP/

# Upload to server
scp -i your-key.pem STP.tar.gz ubuntu@54.123.45.67:~/

# On server, extract
ssh -i your-key.pem ubuntu@54.123.45.67
tar -xzf STP.tar.gz
cd STP
```

**Option B: Using Git:**
```bash
# On server
git clone https://github.com/yourusername/STP.git
cd STP
```

#### **4. Modify Server Code:**

**On the cloud server, edit `src/net/udp.rs`:**
```rust
// Change line 40 to bind to all interfaces:
pub const SERVER_ADDR: &str = "0.0.0.0:9000";
```

**Build and run:**
```bash
cargo build --release
nohup ./target/release/STP server > server.log 2>&1 &
```

#### **5. Modify Client Code (on your local computer):**

**Edit `src/net/udp.rs`:**
```rust
// Change line 40 to your cloud server's public IP:
pub const SERVER_ADDR: &str = "54.123.45.67:9000";
```

**Build and run:**
```bash
cargo build --release
cargo run --release -- client
```

### **Expected Result:**
Client connects to cloud server over the internet!

---

## 🐳 SCENARIO 3: Docker Deployment

### **Step-by-Step:**

#### **1. Create Dockerfile:**

Create a file named `Dockerfile` in your STP directory:

```dockerfile
# Build stage
FROM rust:1.75-slim as builder

WORKDIR /app
COPY . .

# Build the release binary
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install required libraries
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy the binary from builder
COPY --from=builder /app/target/release/STP /usr/local/bin/stp

# Expose UDP port
EXPOSE 9000/udp

# Set the entrypoint
ENTRYPOINT ["stp"]
CMD ["server"]
```

#### **2. Create docker-compose.yml:**

```yaml
version: '3.8'

services:
  stp-server:
    build: .
    ports:
      - "9000:9000/udp"
    restart: unless-stopped
    command: server
    
  stp-client:
    build: .
    depends_on:
      - stp-server
    command: client
    environment:
      - SERVER_ADDR=stp-server:9000
```

#### **3. Build and Run:**

```bash
# Build the Docker image
docker build -t stp-server .

# Run server
docker run -d -p 9000:9000/udp --name stp-server stp-server

# Run client (in another terminal)
docker run --rm --network host stp-server client
```

---

## 🔐 SCENARIO 4: Production with Configuration File

### **Better Approach: Use Configuration Files**

#### **1. Create config.toml:**

```toml
# config.toml
[server]
address = "0.0.0.0"
port = 9000

[client]
server_address = "192.168.1.100"
server_port = 9000

[security]
# In production, this would be generated via key exchange
session_key = "0001020304050607080910111213141516171819202122232425262728293031"

[flow_control]
initial_window = 65536
max_window = 1048576
```

#### **2. Add Dependencies:**

```toml
# Add to Cargo.toml
[dependencies]
aes-gcm = "0.10"
rand = "0.8"
serde = { version = "1.0", features = ["derive"] }
toml = "0.8"
```

#### **3. Create Config Module:**

```rust
// src/config.rs
use serde::Deserialize;
use std::fs;

#[derive(Debug, Deserialize)]
pub struct Config {
    pub server: ServerConfig,
    pub client: ClientConfig,
    pub security: SecurityConfig,
    pub flow_control: FlowControlConfig,
}

#[derive(Debug, Deserialize)]
pub struct ServerConfig {
    pub address: String,
    pub port: u16,
}

#[derive(Debug, Deserialize)]
pub struct ClientConfig {
    pub server_address: String,
    pub server_port: u16,
}

#[derive(Debug, Deserialize)]
pub struct SecurityConfig {
    pub session_key: String,
}

#[derive(Debug, Deserialize)]
pub struct FlowControlConfig {
    pub initial_window: usize,
    pub max_window: usize,
}

impl Config {
    pub fn load(path: &str) -> Result<Self, Box<dyn std::error::Error>> {
        let contents = fs::read_to_string(path)?;
        let config: Config = toml::from_str(&contents)?;
        Ok(config)
    }
    
    pub fn server_addr(&self) -> String {
        format!("{}:{}", self.server.address, self.server.port)
    }
    
    pub fn client_server_addr(&self) -> String {
        format!("{}:{}", self.client.server_address, self.client.server_port)
    }
}
```

#### **4. Update main.rs:**

```rust
// src/main.rs
mod config;

use config::Config;

fn main() {
    let config = Config::load("config.toml")
        .expect("Failed to load configuration");
    
    let args: Vec<String> = env::args().collect();
    
    if args.len() < 2 {
        eprintln!("Usage: cargo run -- <server|client>");
        process::exit(1);
    }
    
    let result = match args[1].as_str() {
        "server" => {
            net::udp::run_server(&config)
        }
        "client" => {
            net::udp::run_client(&config)
        }
        _ => {
            eprintln!("Unknown command");
            process::exit(1);
        }
    };
    
    if let Err(e) = result {
        eprintln!("Error: {}", e);
        process::exit(1);
    }
}
```

---

## 🚀 QUICK DEPLOYMENT COMMANDS

### **Local Network (Same WiFi):**
```bash
# On Server Computer
# 1. Edit src/net/udp.rs: SERVER_ADDR = "0.0.0.0:9000"
cargo build --release
cargo run --release -- server

# On Client Computer
# 2. Edit src/net/udp.rs: SERVER_ADDR = "192.168.1.XXX:9000"
cargo build --release
cargo run --release -- client
```

### **Cloud Deployment (AWS):**
```bash
# On AWS EC2
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
git clone <your-repo>
cd STP
# Edit src/net/udp.rs: SERVER_ADDR = "0.0.0.0:9000"
cargo build --release
./target/release/STP server

# On Local Computer
# Edit src/net/udp.rs: SERVER_ADDR = "54.123.45.67:9000"
cargo run --release -- client
```

### **Docker:**
```bash
# Build
docker build -t stp .

# Run Server
docker run -d -p 9000:9000/udp stp server

# Run Client
docker run --rm stp client
```

---

## 🔍 TROUBLESHOOTING

### **Problem: Client can't connect to server**

**Check 1: Firewall**
```bash
# Windows
netsh advfirewall firewall add rule name="STP" dir=in action=allow protocol=UDP localport=9000

# Linux
sudo ufw allow 9000/udp
```

**Check 2: Server is listening**
```bash
# Windows
netstat -an | findstr :9000

# Linux
netstat -uln | grep 9000
```

**Check 3: IP address is correct**
```bash
# Windows
ipconfig

# Linux
ip addr show
```

### **Problem: Connection timeout**

**Solution:**
- Verify server is running
- Check firewall rules
- Verify IP address
- Check network connectivity: `ping <server-ip>`

### **Problem: Decryption failed**

**Solution:**
- Ensure both client and server use same `DEMO_SESSION_KEY`
- Rebuild both client and server after changes

---

## 📊 DEPLOYMENT SUMMARY

| What You Want | Where to Change | What to Change |
|---------------|----------------|----------------|
| **Local Network** | `src/net/udp.rs` line 40 | Server: `"0.0.0.0:9000"`<br>Client: `"192.168.1.XXX:9000"` |
| **Cloud Server** | `src/net/udp.rs` line 40 | Server: `"0.0.0.0:9000"`<br>Client: `"<public-ip>:9000"` |
| **Docker** | Create `Dockerfile` | Use provided Dockerfile |
| **Production** | Create `config.toml` | Use configuration file approach |

---

## ✅ NEXT STEPS

1. **Choose your deployment scenario** (LAN, Cloud, Docker)
2. **Follow the step-by-step guide** for that scenario
3. **Test the connection** with the verification commands
4. **Troubleshoot** if needed using the troubleshooting section

---

**Your STP implementation is ready to deploy!** 🚀

Choose the scenario that fits your needs and follow the guide above.
