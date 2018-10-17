FROM node:10.11
WORKDIR /opt/sinopia_profile_editor/

# both package.json AND package-lock.json
COPY package*.json ./

RUN npm install --production

# Everything that isn't in .dockerignore ships
COPY . .

# docker daemon maps app's port
EXPOSE 8000

CMD ["npm", "start"]
