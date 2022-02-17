from flask_restx import Namespace
from api.errors.exceptions import *

errors = Namespace("errors", description="error handler")

@errors.errorhandler(Exception)
def server_error(error):
    return {"message": f"Oops, got an error! {error}"}, 500
