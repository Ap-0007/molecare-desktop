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

MOLECARE_WEBAPP_DIR=$(pwd)
MISSING_CHECKOUT_ERROR_MESSAGE="Missing checkout error message"

if [ $? -ne 0 ]; then
  echo "Error occurred"
fi