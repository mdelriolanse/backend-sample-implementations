import pika, os, time
from dotenv import load_dotenv

load_dotenv()

def pdf_process_function(msg):
    time.sleep(5)
    return

url = os.environ.get("CLOUDAMQP_URL", "amqps://gevlaquk:rliaSf8l5Q6Lvbw_fwfSyqVCP58LKKW8@gorilla.lmq.cloudamqp.com/gevlaquk")
params = pika.URLParameters(url)
connection = pika.BlockingConnection(params)
channel = connection.channel()
channel.queue_declare(queue='pdfprocess')

def callback(ch, method, properties, body):
    pdf_process_function(body)
    print("processed msg")
    return

# set up subscription on the queue
channel.basic_consume('pdfprocess',
    callback,
    auto_ack=True)

channel.start_consuming()
connection.close()