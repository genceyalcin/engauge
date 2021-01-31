FROM python:latest
COPY ./ ./
COPY ./secrets/gcloud.json ./secrets/gcloud.json
RUN pip install -r requirements.txt
ENV FLASK_APP api.py
EXPOSE 5000
CMD ["flask", "run"]