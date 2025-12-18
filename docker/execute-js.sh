#!/bin/sh
timeout 3s node -e "$(cat /dev/stdin)" 2>&1