from bs4 import BeautifulSoup
from os import listdir

path = "./pages/"

names = listdir(path)

for name in names:
    print("\n\n\nREADING " + name + " ========================")
    file = open(path + name, encoding="latin-1")
    soup = BeautifulSoup(file.read(), "lxml")
    content = soup.find("div", id="informacion")
    lists = content.find_all("ol")
    for l in lists:
        defs = l.find_all("li")
        for i in defs:
            print(i.text)
    file.close()

