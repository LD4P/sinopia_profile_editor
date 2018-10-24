FROM node:10.11
WORKDIR /opt/sinopia_profile_editor/

# Everything that isn't in .dockerignore ships
COPY . .

# docker daemon maps app's port
EXPOSE 8000

CMD ["npm", "start"]
