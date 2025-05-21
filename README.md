# Memorichuelas

`Memorichuelas` is an interactive vocabulary-learning app for Puerto Rican spanish. 

## Inspiration and Purpose

The name, a combination of the words memoria (memory) and habichuelas (beans), is a reference to [`Membean`][mem], the online English vocabulary learning service that inspired my project.
[`Membean`][mem] offers its users a personalized and gamified way of acquiring new vocabulary words through interactive quizzes.<br>
My vision was to use this concept and apply it to the preservation and dissemination of Puerto Rican culture; 
To paraphrase from my initial proposal: “Puerto Ricans have historically been displaced from the island at the hands of U.S. colonialism and many have severed connections to the island’s culture and practices. 
Our national dialect of Spanish is one such practice and very few online resources exist to address this.”<br>
`Memorichuelas` is designed for people with some existing knowledge of the Spanish language, enough to read or infer via context clues, as there are available resources online for learning general Spanish.

[mem]: https://membean.com

## Implementation

### Webscraping

To get the data for this project, I scraped the website [`Definiciones-de`][defs], because it features a dictionary of words that are unique to/have unique meanings in Puerto Rican Spanish. I created a text document, [`links.txt`](/project/links.txt), with links to all the words I was going to use (I extracted the links from [this page][directory] using wget and sed). Then the AWK script, [`scraper.cgi`](/cgi-bin/scraper.cgi), that iterates through the text file and downloads the HTML page for each word.The quality of the data is not ideal as individual definition pages oftentimes have unique formatting quirks; It is the AWK script, [`webster.cgi`](/cgi-bin/webster.cgi), that handles the compilation of all the definitions, examples, and citations for each word into a single formatted string stored in the text file [`dict.txt`](/project/links.txt).

[defs]: https://Definiciones-de.com
[directory]: https://www.definiciones-de.com/Definicion/Cat/134_0.php#gsc.tab=0

### Webapp

Finally, it is the AWK script [`memorichuelas.cgi`](/cgi-bin/memorichuelas.cgi) that renders the HTML for the user interface, passing along the [`dict.txt`](/project/dict.txt) string to the browser. The website then parses that string using JavaScript, which is also used to handle all the logic and dynamic functionality of the website; It features a starting page for users to choose which words to learn , a bibliography page with citations for each definition page, and last but not least, the quiz game. Users select between 2-15 words to play the learning quiz, which keeps track of a score value for each word selected. This value starts at `0` for each selected word, increments by `.25` for each correct response, decrements by the same amount for incorrect responses, and is used to determine the sequence of quizzes/definitions that are shown to the user; The app serves quizzes for each word based on its score, showing users quizzes for words with lower scores more often than ones with higher scores. Once all words have a value of `1`, the quiz game ends.
