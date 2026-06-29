#!/bin/bash
# ShopForge Backend Hook — backend/
# Runs PreToolUse for Bash and Edit/Write operations in the backend

TOOL="$1"
TARGET="$2"
COMMAND="$3"

# --- DANGEROUS COMMAND BLOCK (Bash tool) ---
if [ "$TOOL" = "Bash" ]; then
  if echo "$COMMAND" | grep -qE "git push --force|git reset --hard|git clean -f"; then
    echo "BLOCKED: Destructive git command not allowed." >&2
    exit 1
  fi
  if echo "$COMMAND" | grep -qE "dropDatabase|db\.dropDatabase|mongosh.*drop"; then
    echo "BLOCKED: Database drop command. Use seed.ts to reset data." >&2
    exit 1
  fi
  if echo "$COMMAND" | grep -qE "rm -rf backend/src|rm -rf backend/uploads"; then
    echo "BLOCKED: Recursive delete of source or uploads directory." >&2
    exit 1
  fi
fi

# --- PROTECT SENSITIVE FILES (Edit/Write tool) ---
if [ "$TOOL" = "Edit" ] || [ "$TOOL" = "Write" ]; then
  # Block editing .env (not .env.example)
  if echo "$TARGET" | grep -qE "backend/\.env$|backend/\.env\.local$"; then
    echo "BLOCKED: Do not edit .env directly. Update .env.example and set values manually." >&2
    exit 1
  fi
  # Block editing migration files if they exist
  if echo "$TARGET" | grep -qE "\.sql$|migrations/.*\.ts$"; then
    echo "WARNING: Editing a migration file. Ensure this is intentional." >&2
  fi
fi

# --- SECRET SCAN (Edit/Write on .ts files) ---
if [ "$TOOL" = "Edit" ] || [ "$TOOL" = "Write" ]; then
  if echo "$TARGET" | grep -qE "\.ts$"; then
    # Detect hardcoded secrets patterns
    if echo "$COMMAND" | grep -qiE "(secret|password|token|key)\s*[:=]\s*['\"][a-zA-Z0-9+/]{16,}['\"]"; then
      echo "BLOCKED: Possible hardcoded secret detected. Use process.env.VARIABLE_NAME instead." >&2
      exit 1
    fi
    # Detect MongoDB connection strings
    if echo "$COMMAND" | grep -qE "mongodb(\+srv)?://[^process]"; then
      echo "BLOCKED: Hardcoded MongoDB URI detected. Use process.env.MONGODB_URI instead." >&2
      exit 1
    fi
  fi
fi

exit 0
