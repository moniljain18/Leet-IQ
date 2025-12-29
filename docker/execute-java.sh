#!/bin/sh
cat > /tmp/Solution.java
javac /tmp/Solution.java 2>&1
if [ $? -eq 0 ]; then
    java -cp /tmp Solution 2>&1
    if [ -f /sys/fs/cgroup/memory.peak ]; then
        echo "__MEMORY_USAGE__$(cat /sys/fs/cgroup/memory.peak)"
    elif [ -f /sys/fs/cgroup/memory/memory.max_usage_in_bytes ]; then
        echo "__MEMORY_USAGE__$(cat /sys/fs/cgroup/memory/memory.max_usage_in_bytes)"
    fi
fi