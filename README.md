# Memorichuelas

`Memorichuelas` is an interactive vocabulary-learning app for Puerto Rican spanish. 

## Inspiration and Purpose

The name, a combination of the words memoria (memory) and habichuelas (beans), is a reference to [`Membean`][mem], the online English vocabulary learning service that inspired my project.
[`Membean`][mem] offers its users a personalized and gamified way of acquiring new vocabulary words through interactive quizzes.<br>
My vision was to use this concept and apply it to the preservation and dissemination of Puerto Rican culture; 
To paraphrase from my initial proposal: Puerto Ricans have historically been displaced from the island at the hands of U.S. colonialism and many have severed connections to the island’s culture and practices. 
Our national dialect of Spanish is one such practice and very few online resources exist to address this.<br>
`Memorichuelas` is designed for people with some existing knowledge of the Spanish language, enough to read or infer via context clues, as there are available resources online for learning general Spanish.

[mem]: https://membean.com

## Implementation

Version 0.1.7 of `Memorichuelas` aims to implement all functionality except set management and quiz games, which means about 1/2 of the app's overall functionality is implemented.

`Memorichuelas` uses a layered architecture with 3 layers:

### Frontend
`React`, and `Vite`.

### Backend
`Node.js`, and `express.js`.

### Database
`PostgreSQL`.

See the [0.1.3 release page][prot] for more info on that specific implementation, a new design is currently in the works.

[prot]: https://github.com/rolazabal/Memorichuelas/releases/tag/v1.3
