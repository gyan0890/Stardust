FROM python:3.7.8-slim

COPY requirements/common.txt requirements/common.txt
RUN pip install -U pip && pip install -r requirements/common.txt
RUN python -m nltk.downloader all

COPY ./api /app/api
COPY ./bin /app/bin
COPY wsgi.py /app/wsgi.py
WORKDIR /app

EXPOSE 8080

ENTRYPOINT ["bash", "/app/bin/run.sh"]