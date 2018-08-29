FROM node:8-alpine

# copying file to Docker Image
RUN ["mkdir", "-p", "/app"]
WORKDIR /app
COPY . .


# installing depedencies
RUN ["rm", "-rf", "node-modules"]
RUN ["npm", "install"]

# making the Arguments
ARG PORT=81
ARG NODE_ENV=production
ARG DATABASE_HOST=database
ARG DATABASE_NAME=glosarium

# exposing Port
EXPOSE $PORT

# setting up environment
ENV NODE_ENV $NODE_ENV
ENV PORT $PORT
ENV DATABASE_HOST $DATABASE_HOST
ENV DATABASE_NAME $DATABASE_NAME

# starting
CMD ["npm", "start"]
