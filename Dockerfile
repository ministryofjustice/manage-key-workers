FROM node:8.4-slim
ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_DATE

# Create app directory
RUN mkdir -p /app
WORKDIR /app
ADD . .

RUN yarn --frozen-lockfile && \
    yarn build && \
    export BUILD_NUMBER=${BUILD_NUMBER} && \
    export GIT_REF=${GIT_REF} && \
    export GIT_DATE=${GIT_DATE} && \
    yarn record-build-info

ENV PORT=3000
ENV API_ENDPOINT_URL=http://localhost:8080/api/
ENV APPINSIGHTS_INSTRUMENTATIONKEY=secretkey
ENV USE_API_GATEWAY_AUTH=no
ENV NOMS_PRIVATE_KEY=secretkey
ENV NOMS_TOKEN=secrettoken

EXPOSE 3000
CMD [ "yarn", "start:prod" ]
