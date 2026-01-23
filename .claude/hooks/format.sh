#!/bin/bash
# PostToolUse hook: Auto-format files after Edit/Write operations
# This hook is triggered by Claude Code after file modifications

# Get the file that was modified from the environment
FILE="$CLAUDE_FILE_PATH"

# Exit if no file path provided
if [ -z "$FILE" ]; then
  exit 0
fi

# Only format if file exists and is a supported type
if [ ! -f "$FILE" ]; then
  exit 0
fi

# Get file extension
EXT="${FILE##*.}"

# Run Prettier for supported file types
case "$EXT" in
  ts|tsx|js|jsx|json|md|css|scss)
    npx prettier --write "$FILE" 2>/dev/null || true
    ;;
esac

exit 0
