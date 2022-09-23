import pyshark
import time
import pymongo
from bson.objectid import ObjectId

prev_frame_time = 0 
new_frame_time = 0

cluster = pymongo.MongoClient("<Give Your Mongo Server>")
db = cluster["test"]
collection = db["machines"]
traffic = db["traffics"]
print("Connected to MongoDB")


iface_name = 'Local Area Connection* 2'
capture = pyshark.LiveCapture(
    interface=iface_name,
)
print("Capturing on interface: {}".format(iface_name))
capture.sniff(timeout=1)
time.sleep(0.3)
print(len(capture))
for packet in capture:
    x = collection.find_one({'Machinemac': packet.eth.src})
    try:   
        if x and packet.ip.dst not in x['domain']:
            collection.update_one({'Machinemac': packet.eth.src},{'$push': {'domain' : packet.ip.dst}},True)
        if x :
            collection.update_one({'Machinemac': packet.eth.src},{'$inc': {'daily.packetssent' : 1}},True)
        y = collection.find_one({'Machinemac': packet.eth.dst})
        if y:
            collection.update_one({'Machinemac': packet.eth.dst},{'$inc': {'daily.packetrecived' : 1}},True)
        print('source: ' + packet.ip.src + " destination: " + packet.ip.dst)
        print('source mac: ' + packet.eth.src + " destination mac: " + packet.eth.dst)
        print("##############################################################################################################")
    except:
        print("Error")
        pass