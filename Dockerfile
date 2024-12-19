# Stage 1: Build Angular frontend
FROM node:18 AS build-frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend ./
RUN npm run build --prod

# Stage 2: Build and compile the TypeScript server
FROM node:18 AS build-server
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server ./
RUN npx tsc

# Stage 3: Final image to serve the app
FROM node:18
WORKDIR /app

# Copy compiled server code
COPY --from=build-server /app/server/dist ./server

# Copy built Angular files
COPY --from=build-frontend /app/frontend/dist/heatlink/browser ./server/public

# Install only production dependencies for the server
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm install --production

EXPOSE 3000
CMD ["node", "server/app.js"]