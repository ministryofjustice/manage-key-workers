
### Example test deploy command

```
helm --namespace manage-key-workers-dev  --tiller-namespace manage-key-workers-dev upgrade manage-key-workers ./manage-key-workers/ --install --values=values-dev.yaml --values=secrets-example.yaml --dry-run --debug
```

Test template output:

```
helm template ./manage-key-workers/ --values=values-dev.yaml --values=secrets-example.yaml
```

### Rolling back a release
Find the revision number for the deployment you want to roll back:
```
helm --tiller-namespace manage-key-workers-dev history manage-key-workers -o yaml
```
(note, each revision has a description which has the app version and circleci build URL)

Rollback
```
helm --tiller-namespace manage-key-workers-dev rollback manage-key-workers [INSERT REVISION NUMBER HERE] --wait
```

### Helm init

```
helm init --tiller-namespace manage-key-workers-dev --service-account tiller --history-max 200
```

### Setup Lets Encrypt cert

Ensure the certificate definition exists in the cloud-platform-environments repo under the relevant namespaces folder

e.g.
```
cloud-platform-environments/namespaces/live-1.cloud-platform.service.justice.gov.uk/[INSERT NAMESPACE NAME]/05-certificate.yaml
```
