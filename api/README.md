# Kylin API

This API is set up for use with Python >= 3.7 and [Docker](https://www.docker.com/). You can set-up your local environment manually or compose up with docker to launch a containerised version of the API.
```bash
git clone https://github.com/Kylin-Network/kylin-api.git
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
Query database:
```bash
curl "http://localhost:8080/database/query?sql=SELECT * FROM action_receipts_actions"
```

Write to database:
```bash
curl -d '{"receipt_id": "GBYfvyGJHJu97QTZTkKZj7Z7uN1BQmCMH6dtwABWPaxa", "index_in_action_receipt": "0", "action_kind": "CREATE_ACCOUNT", "args": "{}", "receipt_predecessor_account_id": "testnet", "receipt_receiver_account_id": "loganbon.testnet", "receipt_included_in_block_timestamp": "1642436645827700480"}' "http://localhost:8080/database/insert"
```

## Testing the API

Testing the API is set up using `pytest`. To execute tests you can install the project's development dependencies with:

```bash
pip install -r requirements/develop.txt
```
Then from the root directory, run:
```bash
pytest
```
This runs `tests/test_api.py` which contains test functions.

## Accessing the Swagger 
With the application running, use the browser to search the following:
```bash
http://localhost:8080/
```

You can see the API's specification and try it directly from the swagger UI.  

Inside each namespace you will see the list of the endpoints available. You can test them using the `try_out` button.
