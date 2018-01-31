# Use an official Python runtime as a parent image
FROM node:6
# Set the working directory to /app
WORKDIR /app

# Copy the current package.json into the container at /app
COPY package.json /app

# Install any needed packages specified in package.json
RUN npm install
# Copy content
COPY . /app

# Make port 4000 available to the world outside this container
EXPOSE 4000

# Run server when the container launches
CMD npm start