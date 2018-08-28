FROM node:8-alpine
RUN ["mkdir", "-p", "/app"]
WORKDIR /app
COPY . .
RUN ["rm", "-rf", "node-modules"]
RUN ["npm", "install"]
ARG PORT=7000
ARG NODE_ENV=production
EXPOSE $PORT
ENV NODE_ENV $NODE_ENV
ENV PORT $PORT
CMD ["npm", "start"]