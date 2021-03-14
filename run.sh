# compile typescript
tsc
# Make the typescript usable in the browser
babel dist/yodel.js -o dist/yodel.js
# Minimize + handle imports for the browser
webpack
# Build documentation
./compileDocumentation.sh

# Move new minimized yodel.js to host location
#cp dist/yodel.js docs/dist/yodel.js
#cp dist/yodel.js.map docs/dist/yodel.js.map