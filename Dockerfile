#FROM nginx
#COPY dist /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/default.conf
#

# Use the official Node.js runtime as the base image
FROM node:20 as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the container
COPY . .

# Set build arguments as environment variables
ARG VITE_BACKEND
ARG VITE_FRONTEND
ARG VITE_DATABASE
ARG VITE_PRODSTATE

ENV VITE_BACKEND=$VITE_BACKEND
ENV VITE_FRONTEND=$VITE_FRONTEND
ENV VITE_DATABASE=$VITE_DATABASE
ENV VITE_PRODSTATE=$VITE_PRODSTATE

# Build the React app for production
RUN npm run build

# Use Nginx as the production server
FROM nginx:alpine

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]