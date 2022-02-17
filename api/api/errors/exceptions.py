class GenericError(Exception):
    def __init__(self,
            message="Generic error raised",
            status_code=404,
            payload=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.payload = payload
        