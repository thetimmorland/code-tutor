.PHONY:
react-dev:
	npm start --prefix react

.PHONY:
server-dev:
	npm run dev --prefix server

server/static: react
	npm run build --prefix react && mv react/build server/static

deplay: server/static
	git subtree push --prefix server heroku master
