#! /usr/bin/awk -f
function getWord(file) {
	found = 0
	str = ""
	definitions = ""
	examples = ""
	credit = ""
	sep = "&"
	cit = 0
	while (getline < file && found < 6) {
		if (found == 0) {
			# get word name
			if ($0 ~ /id=\"titular_principal\"/) {
				match($0, /o;.*&r/)
				name = substr($0, RSTART + 2, RLENGTH - 4)
				str = str name "#"
			}
			if ($0 ~ /id=\"informacion\"/) found = 1
	    	} else if (found == 1) {
			# copy from info div above until the snips element
			if ($0 ~ /class=\"snips\"/) found = 2
			else {
				add = process($0)
				gsub(/\.$/, ". ", add)
				str = str add
			}
		} else if (found == 2 && $0 ~ /=\"list-style:none\"/) {
			found = 3
			string = ""
		} else if (found == 3) {
			# copy elements from definitions list
			if ($0 ~ /<\/ol>/) {
				match($0, /<\/ol>/)
				string = string substr($0, 0, RSTART)
				found = 4
			} else string = string $0
		} else if (found == 4) {
			# remove newline characters
			gsub(//, "", string)
			split(string, defs, "<LI>")
			# analyze each list item
			for (l = 1; l <= length(defs); l ++) {
				split(defs[l], stup, "<i>")
				hold = ""
				detect = 0
				for (stu in stup) {
					# remove etimology snip case
					match(stup[stu], /<a name=\"etimologia_snip/)
					if (RLENGTH != -1) {
						stup[stu] = substr(stup[stu], 0, RSTART)
					}
					if (stup[stu] ~ /Ejemplos de uso:/ || stup[stu] ~ /Ejemplo de uso:/) {
						detect = 0
						hold = ""
						new2 = ""
						split(stup[stu], comp, "<br \/>")
						for (item in comp) {
							ex = process(comp[item])
							match(ex, /'.*'/)
							ex = substr(ex, RSTART + 1, RLENGTH - 2)
							if (length(ex) > 1) {
								new2 = new2 ex sep
							}
						}
						examples = new2 sep examples
					} else if (!(stup[stu] ~ /se emplea en:/)) {
						new1 = ""
						split(stup[stu], comp, "<br \/>")
						for (k = length(comp); k > 0; k --) {
							def = process(comp[k])
							if (!(def ~ /CC/) && !(def ~ /[0-9]*;/) && !(def ~ /[Aa]cepci.n/)) {
								if (detect == 1 && length(def) > 1) {
									def = def " " process(hold)
									hold = ""
									detect = 0
								}
								if (length(def) > 1) {
									new1 = def sep new1
								}
							}
						}
						definitions = new1 sep definitions
					} else {
						hold = hold stup[stu]
						detect = 1
					}
				}
			}		
			found = 5
		} else if (found == 5) {
			if ($0 ~ /citar_snip/) cit = 1
			if (cit == 1 && $0 ~ /seccion_titular/) {
				match($0, /<span/)
				citation = process(substr($0, RSTART))
				found = 6
			}
		}	
	}
	# remove trailing whitespace
	gsub(/[[:blank:]]*$/, "", definitions)
	gsub(/[[:blank:]]*$/, "", examples)
	# remove excess separators
	gsub(/\&+/, "\&", definitions)
	gsub(/\&+/, "\&", examples)
	# remove trailing separators
	gsub(/\&$/, "", definitions)
	gsub(/\&$/, "", examples)
	gsub(/\&$/, "", str)
	# join
	ret = str sep definitions "#" examples "#" citation
	gsub(//, "", ret)
	return ret
}
function process(str) {
	gsub(/<[^>]*>/, "", str)
	gsub(/^[[:blank:]]*/, "", str)
	gsub(/[[:blank:]]+/, " ", str)
	gsub(/\&diams;/, "", str)
	#gsub(/\&iacute;/, "", str)
	gsub(/"/, "'", str)
	gsub(/<$/, "", str)
	gsub(/#/, "", str)
	return str
}
BEGIN {
	start = 1
	end = 680
	dict = ""
	for (i = start; i <= end; i ++) {
		file = "public_html/project/html/" i ".html"
		if (i == end) dict = dict getWord(file)
		else dict = dict getWord(file) "$"
	}
	print dict > "public_html/project/dict.txt"	
}
