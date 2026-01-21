# STP Testing and Running Guide

## ✅ Prerequisites Checklist

Before you begin, ensure you have:
- [x] Rust installed (verify with `rustc --version`)
- [x] Cargo installed (verify with `cargo --version`)
- [x] Terminal/PowerShell **restarted** after Rust installation

## 🏗️ Building the Project

### 1. Navigate to the Project Directory
```powershell
cd c:\Users\THANIGAIVEL\OneDrive\Desktop\STP\reference-implementation
```

### 2. Build in Debug Mode
```powershell
cargo build
```

This will:
- Download and compile all dependencies
- Compile the STP library
- Create a debug build in `target/debug/`

### 3. Build in Release Mode (Optimized)
```powershell
cargo build --release
```

This creates an optimized build in `target/release/` with:
- Full optimizations enabled
- Link-time optimization (LTO)
- Smaller binary size
- Better performance

## 🧪 Running Tests

### Run All Tests
```powershell
cargo test
```

### Run Tests with Output
```powershell
cargo test -- --nocapture
```

### Run Specific Test
```powershell
# Test from lib.rs
cargo test test_version

# Test from connection module
cargo test test_connection_creation

# Test from endpoint module
cargo test test_server_endpoint_creation

# Test from stream module
cargo test test_stream_creation
```

### Run Tests for Specific Module
```powershell
# Test only connection module
cargo test connection::

# Test only endpoint module
cargo test endpoint::

# Test only stream module
cargo test stream::
```

### Run Tests in Release Mode
```powershell
cargo test --release
```

## 📊 Running Benchmarks

**Note**: Benchmark files need to be created first in the `benches/` directory.

Once created, run:
```powershell
cargo bench
```

## 🔍 Code Quality Checks

### Check for Compilation Errors (Without Building)
```powershell
cargo check
```

### Run Clippy (Linter)
```powershell
cargo clippy
```

### Format Code
```powershell
cargo fmt
```

### Check Formatting
```powershell
cargo fmt -- --check
```

## 📖 Documentation

### Generate and Open Documentation
```powershell
cargo doc --open
```

This will:
- Generate HTML documentation for your crate and all dependencies
- Open it in your default browser

### Generate Documentation (Without Opening)
```powershell
cargo doc
```

## 🐛 Debugging

### Build with Debug Symbols
```powershell
cargo build
```

### Run with Verbose Output
```powershell
cargo build -vv
cargo test -vv
```

### Clean Build Artifacts
```powershell
cargo clean
```

Then rebuild:
```powershell
cargo build
```

## 🚀 Example Usage

Currently, the STP implementation has stub modules. Here's what you can do:

### 1. Run the Basic Test Suite
```powershell
cargo test
```

Expected output:
```
running 5 tests
test tests::test_version ... ok
test connection::tests::test_connection_creation ... ok
test endpoint::tests::test_client_endpoint_creation ... ok
test endpoint::tests::test_server_endpoint_creation ... ok
test stream::tests::test_stream_creation ... ok

test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

### 2. Create a Simple Example

Create `examples/simple_server.rs`:
```rust
use stp::{Config, Endpoint};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let config = Config::default();
    let server = Endpoint::server("127.0.0.1:4433", config).await?;
    println!("Server listening on {}", server.local_addr());
    Ok(())
}
```

Run it:
```powershell
cargo run --example simple_server
```

## 📝 Current Implementation Status

### ✅ Implemented Modules
- `config` - Configuration management
- `crypto` - Cryptographic primitives
- `error` - Error handling
- `packet` - Packet encoding/decoding
- `connection` - Connection management (stub)
- `endpoint` - Endpoint management (stub)
- `stream` - Stream multiplexing (stub)

### ⚠️ Stub Implementations
The following modules have basic structure but need full implementation:
- Connection handshake
- Stream data transfer
- Congestion control
- Flow control
- Connection migration

## 🔧 Troubleshooting

### Issue: "cargo: command not found"
**Solution**: Restart your terminal after installing Rust

### Issue: Compilation errors
**Solution**: 
1. Clean the build: `cargo clean`
2. Update dependencies: `cargo update`
3. Rebuild: `cargo build`

### Issue: Tests failing
**Solution**: Check the test output for specific errors and fix the code accordingly

### Issue: Slow compilation
**Solution**: 
- Use `cargo check` for faster feedback during development
- Enable incremental compilation (enabled by default)
- Use `cargo build` instead of `cargo build --release` during development

## 📚 Next Steps

1. **Implement Core Functionality**: Complete the stub implementations
2. **Add Integration Tests**: Create tests in `tests/` directory
3. **Add Benchmarks**: Create benchmark files in `benches/` directory
4. **Create Examples**: Add example programs in `examples/` directory
5. **Performance Testing**: Compare with QUIC and TCP implementations

## 🎯 Quick Command Reference

| Command | Description |
|---------|-------------|
| `cargo build` | Build in debug mode |
| `cargo build --release` | Build in release mode |
| `cargo test` | Run all tests |
| `cargo test --test <name>` | Run specific test file |
| `cargo bench` | Run benchmarks |
| `cargo check` | Check for errors without building |
| `cargo clippy` | Run linter |
| `cargo fmt` | Format code |
| `cargo doc --open` | Generate and open docs |
| `cargo clean` | Clean build artifacts |
| `cargo update` | Update dependencies |
| `cargo tree` | Show dependency tree |

## 📞 Getting Help

- Run `cargo --help` for general help
- Run `cargo <command> --help` for command-specific help
- Check the [Cargo Book](https://doc.rust-lang.org/cargo/)
- Check the [Rust Book](https://doc.rust-lang.org/book/)
