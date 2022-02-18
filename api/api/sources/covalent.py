import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from multiprocessing import cpu_count
from api.errors.exceptions import GenericError

class Covalent:
    def __init__(self):
        self.market_url = "https://api.covalenthq.com/v1/CHAIN_ID/nft_market/?quote-currency=USD&format=JSON&page-size=100000&key=ckey_7e1dbfa2240d44328403b6f78bd"
        self.collection_url = "https://api.covalenthq.com/v1/CHAIN_ID/nft_market/collection/COLLECTION_ADDRESS/?from=2021-01-01&key=ckey_7e1dbfa2240d44328403b6f78bd"
        self.number_token_ids = "https://api.covalenthq.com/v1/CHAIN_ID/tokens/COLLECTION_ADDRESS/nft_token_ids/?key=ckey_7e1dbfa2240d44328403b6f78bd"
        self.max_workers = cpu_count()

    def get_collection(self, chain_id, collection_address):
        payload = {}
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            kwargs = {
                "chain_id": chain_id,
                "collection_address": collection_address,
            }
            futures_list = [
                executor.submit(self.get_market, **kwargs),
                executor.submit(self.get_historical_collection, **kwargs),
                executor.submit(self.get_number_token_ids, **kwargs),
            ]

            for future in as_completed(futures_list):
                payload.update(future.result())

        return payload

    def get_market(self, chain_id, collection_address):
        url = self.market_url.replace("CHAIN_ID",chain_id)
        results = requests.get(url).json()

        for result in results["data"]["items"]:
            if result["collection_address"] == collection_address:
                return {
                    "max_price_quote": result["max_price_quote"],
                    "current_7day_floor_price": result["floor_price_quote_7d"],
                    "market_cap_quote": result["market_cap_quote"],
                    "unique_wallet_purchase_count_alltime": result["unique_wallet_purchase_count_alltime"],
                    "quote_currency": result["quote_currency"],
                    "unique_token_ids_sold_count_alltime": result["unique_token_ids_sold_count_alltime"],
                }
        
        # If collection address not found, raise error
        raise GenericError(f"Collection address not found")

    def get_historical_collection(self, chain_id, collection_address):
        url = self.collection_url.replace("CHAIN_ID", chain_id).replace("COLLECTION_ADDRESS", collection_address)
        results = requests.get(url).json()
        payload = {}

        payload["collection_name"] = results["data"]["items"][0]["collection_name"]
        payload["collection_address"] = results["data"]["items"][0]["collection_address"]
        payload["collection_ticker_symbol"] = results["data"]["items"][0]["collection_ticker_symbol"]

        payload["token_ids_sold"] = []
        payload["floor_price_hist"] = []
        for result in results["data"]["items"]:
            payload["token_ids_sold"].append({
                "unique_token_ids_sold_count_day": result["unique_token_ids_sold_count_day"],
                "opening_date": result["opening_date"],
            })
            payload["floor_price_hist"].append({
                "floor_price_quote_7d": result["floor_price_quote_7d"],
                "opening_date": result["opening_date"],
                "quote_currency": result["quote_currency"],
            })
        return payload

    def get_number_token_ids(self, chain_id, collection_address):
        url = self.number_token_ids.replace("CHAIN_ID",chain_id).replace("COLLECTION_ADDRESS", collection_address)
        results = requests.get(url).json()

        if results["data"]["pagination"] is None:
            total_count = len(results["data"]["items"])
        else:
            total_count = results["data"]["pagination"]["total_count"]

        return {
            "number_nfts_in_collection": total_count
        }
