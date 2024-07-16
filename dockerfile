# use node as basefile
FROM node

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

WORKDIR /usr/app
# install matter.js
RUN npm install matter-js
