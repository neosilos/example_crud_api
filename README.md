# example_crud_api
A minimal docker ready django api that implements simple crud with long wait async tasks, connects with postgreSQL and Celery+Redis

#Project structure
backend/
├── app/
│ ├── __init__.py
│ ├── admin.py
│ ├── apps.py
│ ├── migrations/
│ │ └── __init__.py
│ ├── models.py
│ ├── serializers.py
│ ├── views.py
│ ├── urls.py
│ └── tests.py
├── config/
│ ├── __init__.py
│ ├── asgi.py
│ ├── settings.py
│ ├── urls.py
│ └── wsgi.py
├── .env
├── manage.py
├── requirements.txt
├── Dockerfile
└── docker-compose.yml

#To build the containers and setup the persistent data to the db
backend/setup.sh

#Change backend/docker-compose.yml to handle the proper TCP ports if necessary
#Change any .env to match your setup

#The end points are created with the API
http://0.0.0.0:8001/admin/
http://0.0.0.0:8001/api/docs/

#The mock html can be used as reference
frontend/public/static-mock.html

#final frontend should look like this
documentation/example.mp4