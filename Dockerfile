FROM node:10.11

ENV HTML /opt/sinopia_profile_editor/
WORKDIR $HTML

COPY package*.json $HTML
# FIXME: should this be npm install with --production flag?
RUN cd $HTML && npm install

# FIXME: do we want to run grunt locally and copy only dist/ to docker image?
COPY Gruntfile.js $HTML
COPY source/ $HTML/source/
# FIXME: grunt-cli could be an npm devDependency ?
RUN cd $HTML && npm install -g grunt-cli && npm run grunt-dev

COPY dist/ $HTML
COPY server.js $HTML

# docker daemon maps app's port
EXPOSE 8000

CMD ["npm", "start"]
