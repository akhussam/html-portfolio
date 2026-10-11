#!/usr/bin/env bash
# Regenerates Python code from packages/contracts/proto (ADR-004) into src/engine/.
# The output is committed; CI regenerates and fails on any diff.
set -euo pipefail
cd "$(dirname "$0")"
rm -rf src/engine
uv run --frozen python -m grpc_tools.protoc \
  -I ../../packages/contracts/proto \
  --python_out=src --pyi_out=src --connect-python_out=src \
  engine/v1/engine.proto
touch src/engine/__init__.py src/engine/v1/__init__.py
