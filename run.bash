#!/usr/bin/env bash

set -eu

eval "$(linera net helper)"
linera_spawn linera net up --with-faucet

export LINERA_FAUCET_URL=http://localhost:8080
linera wallet init --faucet="$LINERA_FAUCET_URL"
linera wallet request-chain --faucet="$LINERA_FAUCET_URL"

# Build and publish your backend
echo "Building Linera contract..."
cd contract
cargo build --release --target wasm32-unknown-unknown
cd ..

# Install and build frontend dependencies
echo "Installing frontend dependencies..."
pnpm install
echo "Building frontend..."
pnpm dev &

# Wait for frontend to be ready
echo "Waiting for frontend to start on port 5173..."
while ! curl -s http://localhost:5173 > /dev/null; do
    sleep 2
done

echo "Setup complete! Frontend is running on http://localhost:5173"
echo "Faucet is available on http://localhost:8080"

# Keep the script running
wait