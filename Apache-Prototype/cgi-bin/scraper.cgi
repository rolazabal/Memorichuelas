#! /usr/bin/awk -f
BEGIN {
	i = 0
	while (getline < "public_html/project/links.txt") {
		i ++
		link = $0
		print "get page " link
		code = system(sprintf("wget -qO public_html/project/html/%d.html %s", i, link))
		if (code != 0) {
			print "fail!"
			exit 1
		} else {
			time = int(30 * rand())
			print "success, wait " time " seconds"
			system(sprintf("sleep %d", time))
		}
	}
}	
