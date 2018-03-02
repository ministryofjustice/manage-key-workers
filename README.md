# Keyworker UI App

Application can be built with for dev mode

```bash
yarn 
yarn start
```

For production 
```bash
yarn build
node-env mode=PRODUCTION yarn start
```


Run locally as docker
```bash
docker run -p 3000:3000 -d \ 
     --name keyworker-ui \
     -e USE_API_GATEWAY_AUTH=no \
     mojdigitalstudio/keyworker-ui:latest
```

Run remotely as docker
```bash
docker run -p 3000:3000 -d \ 
     --name keyworker-ui \
     -e USE_API_GATEWAY_AUTH=yes \
     -e API_ENDPOINT_URL=https://noms-api-dev.dsd.io/elite2api/ \
     -e API_GATEWAY_TOKEN=<add here> \
     -e API_CLIENT_SECRET=<add here> \
     -e API_GATEWAY_PRIVATE_KEY=<add here> \
     mojdigitalstudio/keyworker-ui:latest
```