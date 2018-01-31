#!/usr/bin/env bash

display_usage() {
  echo -e "\nUsage: $0 [tag] [dev|stage|preprod|prod]\n"
}

promote_to_env() {
  TAG=$1
  ENV=$2

  # Grab the tagged build
  git fetch
  git checkout ${TAG}

  # Push the TAG build to ENV
  git push --force origin origin/deploy-to-${ENV} HEAD:deploy-to-${ENV}

  # Switch back to master branch
  git checkout master
}

# if less than two arguments supplied, display usage 
if [  $# -le 1 ]
then
  display_usage
  exit 1
fi

# check whether user had supplied -h or --help . If yes display usage
if [[ ( $# == "--help") ||  $# == "-h" ]]
then
  display_usage
  exit 0
fi

TAG=$1
ENV=$2

if [[ "$ENV" =~ ^(dev|stage|preprod|prod)$ ]]; then
    echo "Deploying to $ENV"
else
    echo "$ENV is not a valid environment"
fi

promote_to_env ${TAG} ${ENV}



