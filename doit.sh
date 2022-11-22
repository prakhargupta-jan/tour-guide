#!/bin/bash
npm init -y
npm i express mongoose dotenv
npm i -D nodemon
touch app.js server.js
mkdir models routes controllers utils
touch config.env .gitignore ./utils/catchAsync.js ./utils/appError.js
echo 'config.env
node_modules/' >> ./gitignore
echo 'PORT=8000
USERNAME=prakhargupta-jan
DB=mongodb+srv://prakhargupta-jan:<PASSWORD>@cluster0.fduyz.mongodb.net/natours?retryWrites=true&w=majority
DB_PASSWORD=prakharguptapg444
JWT_SECRET=u1tr453cur35up3r54f3p455w0rdnowjustputtingrandomwordstomakestringlonger
JWT_EXPIRES_IN=30d' >> ./config.env