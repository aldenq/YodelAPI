import yodel
import time
yodel.startRadio(
"wlx40a5ef011391"
)
yodel.setChannel(5)
yodel.setName("YodelEcho")
yodel.addGroup("b")
while True:

    data = yodel.listen()
    if data:
        print("Echo Recv:", data)
        time.sleep(0.1)
        yodel.send(data.payload, name="YodelTest", group="a")