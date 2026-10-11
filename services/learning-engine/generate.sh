#!/usr/bin/env bash
# Regenerates Python code from packages/contracts/proto (ADR-004). Output in gen/ is committed;
# CI regenerates and fails on any diff.
set -euo pipefail
cd "$(dirname "$0")"
rm -rf gen && mkdir -p gen
uv run --frozen python -m grpc_tools.protoc \
  -I ../../packages/contracts/proto \
  --python_out=gen --pyi_out=gen --connect-python_out=gen \
  engine/v1/engine.proto
touch gen/engine/__init__.py gen/engine/v1/__init__.py
