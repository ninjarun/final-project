
FROM python:3.10

ENV PYTHONUNBUFFERED 1

WORKDIR /FINAL_PROJECT/backend/

COPY . .

RUN pip install virtualenv

RUN virtualenv env

RUN . env/bin/activate

RUN pip install --no-cache-dir -r requirements.txt

RUN pip install python-decouple

ENV DJANGO_SETTINGS_MODULE=myproj.settings

ENV SECRET_KEY "django-insecure-9t1pstl0+b$+*zr*2*typ5^bhi208(ewp8z-+)h1lr+aqe+9e0"

RUN python manage.py makemigrations

RUN python manage.py migrate

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]