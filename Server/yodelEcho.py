import yodel
import time
yodel.startRadio(
"wlx40a5ef011391"
)
yodel.setChannel(8)
yodel.setName("YodelEcho")
yodel.joinGroup("b")

ft = yodel.Format([yodel.Field("stringval", str, bytes=100)], mtype=5)
s = yodel.Section(ft)

while True:

    data = yodel.listen()
    if data:
        print("Echo Recv:", data)
        
        data = yodel.autoDecode(data)
        if isinstance(data, bytes):
            yodel.send(data.decode(), name="YodelTest", group="a")
        else:
            news = yodel.Section(ft)
            for field in news.fields:
                news[field] = data[field]
            print(news)
            yodel.send(news, name="YodelTest", group="a")
        time.sleep(0.1)