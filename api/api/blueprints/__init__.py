from flask_restx import Api
from api.errors.error_handler import errors
from api.blueprints.collection import collection
from api.blueprints.sentiment import sentiment

api = Api(
    doc='/',
    version='1.0.0',
    title='Stardust API',
    description="Stardust API providing NFT analytics",
)

api.add_namespace(errors)
api.add_namespace(collection, path='/nft')
api.add_namespace(sentiment, path='/sentiment')
