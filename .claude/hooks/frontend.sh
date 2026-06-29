#!/bin/bash
# ShopForge Frontend Hook — frontend/
# Runs PostToolUse for Edit/Write and PreToolUse for sensitive files

TOOL="$1"
TARGET="$2"
CONTENT="$3"

# --- PROTECT SENSITIVE FILES (Edit/Write) ---
if [ "$TOOL" = "Edit" ] || [ "$TOOL" = "Write" ]; then
  if echo "$TARGET" | grep -qE "frontend/\.env\.local$|frontend/\.env$"; then
    echo "BLOCKED: Do not edit .env.local directly. Update .env.example and set values manually." >&2
    exit 1
  fi
fi

# --- FORMAT ON SAVE (PostToolUse Edit/Write on frontend files) ---
if [ "$TOOL" = "PostEdit" ] || [ "$TOOL" = "PostWrite" ]; then
  if echo "$TARGET" | grep -qE "frontend/.*\.(tsx?|jsx?|css)$"; then
    # Run Prettier if available
    if command -v npx &>/dev/null; then
      npx --prefix frontend prettier --write "$TARGET" --log-level silent 2>/dev/null || true
    fi
  fi
fi

# --- WARN ON HARDCODED VALUES (Edit/Write on .tsx/.ts files) ---
if [ "$TOOL" = "Edit" ] || [ "$TOOL" = "Write" ]; then
  if echo "$TARGET" | grep -qE "frontend/.*\.(tsx?|jsx?)$"; then

    # Warn on hardcoded API URLs
    if echo "$CONTENT" | grep -qE "http://localhost:3001|http://localhost:3000"; then
      echo "WARNING: Hardcoded localhost URL detected. Use process.env.NEXT_PUBLIC_API_URL instead." >&2
    fi

    # Warn on hardcoded hex colors (should use Tailwind semantic tokens)
    if echo "$CONTENT" | grep -qE "color:\s*#[0-9a-fA-F]{3,6}|backgroundColor:\s*#[0-9a-fA-F]{3,6}"; then
      echo "WARNING: Hardcoded hex color in component. Use Tailwind semantic tokens (bg-primary, text-text-2, etc.)" >&2
    fi

    # Warn on dangerouslySetInnerHTML
    if echo "$CONTENT" | grep -qE "dangerouslySetInnerHTML"; then
      echo "WARNING: dangerouslySetInnerHTML detected. Ensure content is sanitised before rendering." >&2
    fi

    # Warn on localStorage usage for tokens
    if echo "$CONTENT" | grep -qE "localStorage.setItem.*[Tt]oken|localStorage.setItem.*[Jj]wt"; then
      echo "BLOCKED: Do not store auth tokens in localStorage. Tokens are in httpOnly cookies." >&2
      exit 1
    fi
  fi
fi

exit 0
