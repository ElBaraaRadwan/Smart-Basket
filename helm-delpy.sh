#!/bin/bash
# Helper script to deploy Smart Basket using Helm

# Set default environment
ENVIRONMENT=${1:-dev}

echo "Deploying Smart Basket to $ENVIRONMENT environment"

# Set values file based on environment
VALUES_FILE="charts/smart-basket-umbrella/values-${ENVIRONMENT}.yaml"

if [ ! -f "$VALUES_FILE" ]; then
  echo "Values file $VALUES_FILE not found. Using default values."
  VALUES_FILE="charts/smart-basket-umbrella/values.yaml"
fi

# Deploy with Helm
helm upgrade --install smart-basket charts/smart-basket-umbrella \
  --values $VALUES_FILE \
  --namespace smart-basket \
  --create-namespace \
  --wait

echo "Deployment complete. To access the application:"
kubectl get service -n smart-basket smart-basket-api
