
# Building a Chess AI

This project is chess game app implemented using React. The game involves one user against an AI system of my design.

[Click here for demo.](https://samueltesfai.github.io/react-chess-app/)

Check master branch for source code.

<p >
<img height="500" alt="Screen Shot 2022-12-25 at 6 52 48 PM" src="https://user-images.githubusercontent.com/67299283/209493958-90f8ec18-0452-46ae-aaf6-1f8eab431869.png">
</p>

## Description

The frontend for this project was implemented using React JavaScript. The AI was created with the alpha-beta pruning search algorithm with a depth of 4. 
The heuristic function used to evaluate game positions in this working version of the app only considers the total material of each player. 

I currently have a trained network using PyTorch that evaluates game positions that works pretty well for certain positions (check the main branch for relevant code). Before integrating it into the final app however, I would like experiment some more to get a better final model. One limitation the current model has is evaluating board positions near the start of the game.  

## To Do

Keep working on the network then incorporate it in the heuristic function.
