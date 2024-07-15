# use humble as basefile
FROM osrf/ros:humble-desktop

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh



# update the repository sources list
# and install dependencies
RUN apt-get update && apt-get install -y npm


WORKDIR /usr/app
RUN npm install -g n
RUN n stable
# install three.js
RUN npm install three
# install bullet.js
RUN npm install bullet
# install rclnode.js
RUN source /opt/ros/humble/setup.bash && npm install rclnodejs
