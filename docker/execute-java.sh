#!/bin/sh

cat /dev/stdin > /tmp/Solution.java

javac /tmp/Solution.java 2>&1
if [ $? -ne 0 ]; then
    exit 1
fi

timeout 3s java -cp /tmp Solution 2>&1