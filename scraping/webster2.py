from bs4 import BeautifulSoup
from os import listdir
import re

path = "./pages/"

names = listdir(path)

for name in names:
    print("\n\n\nREADING " + name + " ================================")
    file = open(path + name, encoding="latin-1")
    soup = BeautifulSoup(file.read(), "lxml")
    content = soup.find("div", id="informacion")
    lists = content.find_all("ol")
    for l in lists:
        print("\n\nLIST ==========================")
        defs = l.find_all("li")
        for i in defs:
            words = re.findall(r'\w+', i.text)
            if len(words) <= 1:
                continue

            print("ITEM ++++++++++++++++++++++++++")
            print(i.text)
    file.close()
    wait = input("WAITING...")

