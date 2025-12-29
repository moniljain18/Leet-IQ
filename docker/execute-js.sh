#!/bin/sh
# Use /tmp for writing as it's always writable by all users
CODE_FILE="/tmp/solution.js"
cat > "$CODE_FILE"

# Execute and capture stderr
node "$CODE_FILE" 2>&1

# Capture peak memory if available (cgroup v2 or v1)
if [ -f /sys/fs/cgroup/memory.peak ]; then
    echo "__MEMORY_USAGE__$(cat /sys/fs/cgroup/memory.peak)"
elif [ -f /sys/fs/cgroup/memory/memory.max_usage_in_bytes ]; then
    echo "__MEMORY_USAGE__$(cat /sys/fs/cgroup/memory/memory.max_usage_in_bytes)"
fi