import pika, os, logging
from dotenv import load_dotenv
logging.basicConfig()

load_dotenv()

url = os.environ.get("CLOUDAMQP_URL", "amqps://gevlaquk:rliaSf8l5Q6Lvbw_fwfSyqVCP58LKKW8@gorilla.lmq.cloudamqp.com/gevlaquk")
params = pika.URLParameters(url)
params.socket_timeout = 5

connection = pika.BlockingConnection(params)  # establish connection with RabbitMQ server.
channel = connection.channel()
channel.queue_declare(queue="pdfprocess")

channel.basic_publish(exchange='', routing_key='pdfprocess', body='User information')
connection.close()