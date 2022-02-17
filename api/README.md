# Stardust API

This API is set up for use with Python >= 3.7 and [Docker](https://www.docker.com/). You can set-up your local environment manually or compose up with docker to launch a containerised version of the API.

## Run with Docker
```bash
docker-compose up -d
```

## Running Locally

To run the server locally, you'll need to install a few requirements. To do this, run:

```bash
pip install -r requirements/common.txt
``` 

Then to boot up the server, run:

```bash
bash bin/run.sh
``` 

You should now be able to interact with your server.

## Example Calls
Query collection:
```bash
curl "http://localhost:8080/nft/collection?chain_id=1&collection_address=0xd07dc4262bcdbf85190c01c996b4c06a461d2430"
```

Query twitter sentiment analysis:
```bash
curl "http://localhost:8080/sentiment/text?text=cryptopunks"
```

## Accessing the Swagger 
With the application running, use the browser to search the following:
```bash
http://localhost:8080/
```

You can see the API's specification and try it directly from the swagger UI.  

Inside each namespace you will see the list of the endpoints available. You can test them using the `try_out` button.
