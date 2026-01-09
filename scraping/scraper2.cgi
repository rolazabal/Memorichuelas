#! /usr/bin/awk -f

BEGIN {
	while(getline < "links.txt") {
		cmd = "wget -E --directory-prefix=pages/ " $0
		print("GETTING " $0 " ==========================")
		system(cmd)
	}
}

