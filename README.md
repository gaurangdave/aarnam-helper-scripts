# Helper Scripts

A collection of helper scripts that are reused across many of my projects

# Modules

## Google Storage Helper

-   Wrapper module around `Google Storage Node API`

-   Documentation [Google Storage Node API](https://cloud.google.com/nodejs/docs/reference/storage/2.0.x/)

## Minio Storage Helper

-   Wrapper for `Minio JS SDK`
-   Documentation [Minio JS SDK](https://docs.minio.io/docs/javascript-client-api-reference.html)

## Walker

-   RxJS based directory/file walker.

## Logger

-   Colorful logger for Console events.

## Slack

-   Module to help format messages for slack

# Testing

-   Create a folder with access files (JSON) for Google Storage and Minio.
-   Run the following command `minioKeyFile=/path/to/minio_secret.json googleKeyFile=/path/to/google_secret.json npm test`

# TODOs
- [ ] Write tests for Slack module.
- [ ] Write tests for Logger module.
- [ ] Add Loading indicator for CLI modules. 
- [ ] Add tools for Google Cloud Builder.
     - [ ] Saparate triggers for separate branches. 