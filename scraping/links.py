from bs4 import BeautifulSoup
files = ["134_0.php.html", "134_300.php.html", "134_600.php.html"]
links_file = open("./links.txt", "w")
for name in files:
    print("READING " + name + " ===============================")
    file = open("./" + name, encoding="latin-1")
    soup = BeautifulSoup(file.read(), "lxml")
    div = soup.find("div", id="listado")
    tables = div.find_all("table")
    for table in tables:
        links = table.find_all("a")
        if len(links) > 200:
            for i in links:
                links_file.write(i["href"] + "\n")
            break
    file.close()
links_file.close()
