import {Database}from './db'

interface Room {
    question: string;
    solution: string;
    hint: string;
    et: number;
    difficulty: string;
  }
  
  interface Tag {
    puzzleType: string;
    rooms: Room[]
  }

  interface Puzzles {
    tags: Tag[]
  }
  
  const initial: Puzzles = {
    tags: []
  }

  const db = new Database<Puzzles>('./rooms.json', initial)

  /* usage of the database
  db.update({
    tags:  [{
        type: Anagram
        rooms: [{
            question: flavourtext describing the puzzle and including the question,
            solution: solution to the puzzle,
            et: 20,
            difficulty: easy
        }]
    }]
  })

  db.commit(); //write to file

  console.log(db.data) //read from file
  */
  
