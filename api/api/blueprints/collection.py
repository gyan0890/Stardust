from flask import make_response, request
from flask_restx import Resource, Namespace
from api.sources.covalent import Covalent

collection = Namespace("collection", description="NFT collection data")
covalent = Covalent()

@collection.route('/collection', endpoint='nft/collection')
@collection.param('chain_id', 'Chain ID')
@collection.param('collection_address', 'NFT collection address')
class Collection(Resource):
    def get(self):
        chain_id = request.args["chain_id"]
        collection = request.args["collection_address"]
        result = covalent.get_collection(chain_id, collection)
        return make_response(result, 200)
