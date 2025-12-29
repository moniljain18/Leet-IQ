#!/bin/sh
CODE_FILE="/tmp/solution.py"
cat > "$CODE_FILE"

python3 "$CODE_FILE" 2>&1

if [ -f /sys/fs/cgroup/memory.peak ]; then
    echo "__MEMORY_USAGE__$(cat /sys/fs/cgroup/memory.peak)"
elif [ -f /sys/fs/cgroup/memory/memory.max_usage_in_bytes ]; then
    echo "__MEMORY_USAGE__$(cat /sys/fs/cgroup/memory/memory.max_usage_in_bytes)"
fi