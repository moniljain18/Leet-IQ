#!/bin/sh
# Save the code to Main.java (the wrapper class is called Main)
cat > /tmp/Main.java

# Compile with JSON library
javac -cp /app/json.jar:/tmp /tmp/Main.java 2>&1

if [ $? -eq 0 ]; then
    # Run the Main class with JSON library in classpath
    java -cp /app/json.jar:/tmp Main 2>&1
    
    # Report memory usage if available
    if [ -f /sys/fs/cgroup/memory.peak ]; then
        echo "__MEMORY_USAGE__$(cat /sys/fs/cgroup/memory.peak)"
    elif [ -f /sys/fs/cgroup/memory/memory.max_usage_in_bytes ]; then
        echo "__MEMORY_USAGE__$(cat /sys/fs/cgroup/memory/memory.max_usage_in_bytes)"
    fi
fi