#!/bin/sh

DIR="$npm_package_name-$npm_package_version"
ARCHIVE="$DIR.tar.gz"

if [ ! -d ./build ]
then
    echo 'Unable to locate build directory. Did you run `npm run build` first?'
    exit 1
fi

rm -rf "$DIR"
mkdir "$DIR"
cp -r ./build ./pb_migrations "$DIR"
tar czf "$ARCHIVE" "$DIR"
rm -rf "$DIR"

echo "Successfully created package $ARCHIVE"