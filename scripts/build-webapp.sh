#!/bin/bash

# Check if we're running on Windows
if [ "$(uname -s)" == "MINGW"* ]; then
  # Run build:win command
  npm run build:win || exit 1
else
  # Run build:linux command
  npm run build:linux || exit 1
fi

echo $?