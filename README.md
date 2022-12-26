
# Building a Chess AI

This project is chess game app implemented using React. The game involves one user against an AI system of my design.

[Click here for demo.](https://samueltesfai.github.io/react-chess-app/)

Check master branch for source code.

<p >
<img height="500" alt="Screen Shot 2022-12-25 at 6 52 48 PM" src="https://user-images.githubusercontent.com/67299283/209493958-90f8ec18-0452-46ae-aaf6-1f8eab431869.png">
</p>

## Description

The frontend for this project was implemented using React JavaScript. The AI was created with the alpha-beta pruning search algorithm with a depth of 4. 
The heuristic function used to evaluate game positions in this working version of the app only considers the total material of each player. The actual
chess game logic is not implemented and instead I used the chess.js API to handle it (implementing the game logic is not the focus of the project and 
is a bit involved). A future goal of the project is to train a neural network to see if we can produce a better heuristic function with it. 

## To Do

Train a neural network and incorporate it in the heuristic function.
