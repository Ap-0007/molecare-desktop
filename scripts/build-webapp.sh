#!/bin/bash
# Build the MoleCare web app and stage it as this app's renderer.
#
# The desktop app is a shell around the web front end, which lives in its own
# repository: https://github.com/MoleCare/molecare-webapp
#
# By default this expects that repository checked out beside this one:
#
#   parent/
#     molecare-desktop/   <- you are here
#     molecare-webapp/
#
# Override with MOLECARE_WEBAPP_DIR if yours lives elsewhere.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DESKTOP_DIR="$(dirname "$SCRIPT_DIR")"
WEBAPP_DIR="${MOLECARE_WEBAPP_DIR:-$(dirname "$DESKTOP_DIR")/molecare-webapp}"
RENDERER_DIR="$DESKTOP_DIR/src/renderer"

if [ ! -d "$WEBAPP_DIR" ]; then
	cat >&2 <<MSG
Could not find the web app at:
  $WEBAPP_DIR

The desktop app packages the MoleCare web front end as its renderer, so you
need that repository checked out. From the directory above this one:

  git clone https://github.com/MoleCare/molecare-webapp.git
  cd molecare-webapp && npm install

Or point at an existing checkout:

  MOLECARE_WEBAPP_DIR=/path/to/molecare-webapp npm run build:webapp
MSG
	exit 1
fi

if [ ! -d "$WEBAPP_DIR/node_modules" ]; then
	echo "Installing web app dependencies..."
	(cd "$WEBAPP_DIR" && npm ci)
fi

echo "Building MoleCare web app for desktop..."
echo "  Web app dir: $WEBAPP_DIR"
echo "  Output dir:  $RENDERER_DIR"

rm -rf "$RENDERER_DIR"
mkdir -p "$RENDERER_DIR"

# BUILD_TARGET=desktop makes the web app emit relative asset paths, which is
# what file:// loading in Electron needs.
(cd "$WEBAPP_DIR" && BUILD_TARGET=desktop npx webpack --mode=production)

cp -r "$WEBAPP_DIR/dist/." "$RENDERER_DIR/"

echo "Web app built successfully for desktop."
