#!/bin/sh

# deploy server to heroku
git subtree push --prefix server heroku master
