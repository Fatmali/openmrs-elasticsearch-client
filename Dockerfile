FROM bitnami/node:6 as builder
ENV NODE_ENV="production"
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 8550
CMD ["node", "cronjob.js"]
