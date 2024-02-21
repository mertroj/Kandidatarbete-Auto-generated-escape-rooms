import {Database}from './db'

interface Puzzle {
    question: string;
    solution: string;
    hint: string;
    et: number;
    difficulty: string;
  }
  
  interface Tag {
    puzzleType: string;
    puzzles: Puzzle[]
  }

  interface Puzzles {
    tags: Tag[]
  }
  
  const initial: Puzzles = {
    tags: []
  }

  const db = new Database<Puzzles>('./puzzles.json', initial)

  /* usage of the database
  db.update({
    tags:  [{
        PuzzleType: Anagram
        puzzles: [{
            question: flavourtext describing the puzzle and including the question,
            solution: solution to the puzzle,
            hint: a hint for the puzzles,
            et: 20,
            difficulty: easy
        }]
    }]
  })

  db.commit(); //write to file

  console.log(db.data) //read from file
  */
  
