#!/bin/bash

project_root="${BASH_SOURCE%/*}"

cd $project_root

printf "Deploying client to github Pages\n"
npm run deploy --prefix client

printf "Deploying server to Heroku\n"
git subtree push --prefix server heroku master
