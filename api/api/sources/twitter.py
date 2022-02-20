from searchtweets import gen_request_parameters, load_credentials, collect_results
import re, string
import pickle
import nltk
nltk.download("punkt")
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag

class Twitter:
    def __init__(self):
        self.search_args = self.load_credentials()
        
        with open("api/sources/naive_bayes_classifier.pkl", 'rb') as fh:
            self.classifier = pickle.load(fh)

    def get_and_classify_tweets(self, search_term):
        tweets = self.get_tweets(search_term)
        payload = {}
        payload["classifications"] = []
        positive_results = 0
        total_results = 0
        for page in tweets:
            data = page["data"]
            for tweet in data:
                classification = self.classify_text(tweet["text"])
                total_results += 1
                if classification == "Positive":
                    positive_results += 1
                payload["classifications"].append({
                    "tweet": tweet["text"],
                    "classification": classification,                
                })
        payload["sentiment_score"] = round((positive_results/total_results)*10, 2)
        return payload

    def classify_text(self, text):
        tokens = self.clean_text(word_tokenize(text))
        return self.classifier.classify(dict([token, True] for token in tokens))

    def load_credentials(self):
        return load_credentials("./api/.twitter_keys.yaml", yaml_key="search_tweets_v2", env_overwrite=False)

    def get_tweets(self, search_term):
        query = gen_request_parameters(search_term, granularity=None, results_per_call=100)
        tweets = collect_results(query, max_tweets=100, result_stream_args=self.search_args)
        return tweets

    def clean_text(self, tweet_tokens, stop_words = ()):
        cleaned_tokens = []
        for token, tag in pos_tag(tweet_tokens):
            # removing unwanted symbols and patterns from tokens using regular expressions
            token = re.sub("http[s]?://+(?:[a-zA-Z]|[0-9]|[$-_@.&+#]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+","", token)
            token = re.sub(".(.co/o).","", token)
            token = re.sub("(@[A-Za-z0-9_]+)","", token)
            token = re.sub("\w*\d\w*","",token)
            token = re.sub('[‘’“”…#–/]', '', token)
            token = re.sub("http[s]?","",token)
            
            # assigning new pos tags for WordNetLemmatizer() function
            if tag.startswith("NN"):
                pos = "n"
            elif tag.startswith("VB"):
                pos = "v"
            else:
                pos = "a"
                
            # lemmatizing tokens (running=run)
            lemmatizer = WordNetLemmatizer()
            token = lemmatizer.lemmatize(token, pos)
            
            # dropping puncuation and stop words
            if len(token) > 0 and token not in string.punctuation and token.lower() not in stop_words:
                cleaned_tokens.append(token.lower())
        return cleaned_tokens
