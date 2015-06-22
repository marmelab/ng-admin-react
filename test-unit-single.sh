#!/bin/bash

if [ ! -d ./src ]
then
    touch jest.lastrun
    ./node_modules/babel/bin/babel/index.js app --out-dir src --stage 1 --compact false > /dev/null
else
    for i in `find app -type f -newer jest.lastrun`
    do
        ./node_modules/babel/bin/babel/index.js $i --out-file `echo $i | sed 's#^app#src#'`
    done
    touch jest.lastrun
fi

./node_modules/jest-cli/bin/jest.js src/$1
