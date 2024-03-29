# Certifaction base github action

This github action will output docker version, tags and labels to be directly
used by the standard `docker/build-push-action@v2` action.

## Inputs

### `token`

**Required** The github token to access the repository

### `image`

**Required** The docker image name

## Outputs

### `version`

The image version

### `tags`

The list of tags to be applied to the image

### `labels`

The labels to be applied to the image

### `push`

True if the image must be pushed

## Usage

```
docker-push:
    runs-on: ubuntu-latest
    services:
      registry:
        image: registry:2
        ports:
          - 5000:5000
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Certifaction base action
        uses: certifaction/github-base-action@v0
        id: base-action
        with:
          image: your-image-name

      - name: Build and push to local registry
        uses: docker/build-push-action@v2
        with:
          push: ${{ steps.base-action.outputs.push }}
          tags: ${{ steps.base-action.outputs.tags }}
          labels: ${{ steps.base-action.outputs.labels }}
```
