from flask import make_response, request, jsonify
from flask_restx import Resource, Namespace
from api.sources.twitter import Twitter

sentiment = Namespace("sentiment", description="Twitter sentiment analysis endpoints")
twitter = Twitter()

@sentiment.route('/text', endpoint='sentiment/text')
@sentiment.param('text', 'Text to analyze')
class NftSentiment(Resource):
    def get(self):
        collection_name = request.args['text']
        result = twitter.get_and_classify_tweets(collection_name)
        return make_response(jsonify(result), 200)
