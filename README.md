# Chess AI using Deep Learning

Chess AI is a project that combines Deep Learning and Chess Game AI to build an intelligent Chess application. This app allows users to play against an AI that utilizes neural networks to improve its move selection and gameplay strategy. This project demonstrates the effective combination of traditional game AI techniques with modern deep learning, opening a path to explore further improvements, optimizations, and potential adaptations to other strategic games.

[Click here for demo](https://samueltesfai.github.io/react-chess-app/)

<img width="810" alt="209493958-90f8ec18-0452-46ae-aaf6-1f8eab431869" src="https://github.com/samueltesfai/react-chess-app/assets/67299283/eae015c0-e117-4329-94a9-cdab4a03b1a4">

## Features
- Interactive interface for playing chess against the AI
- In-game move history and options to undo moves or restart the game
- AI move decision-making powered by alpha-beta pruning and deep learning
- Neural networks trained to predict next moves and game outcomes

## System Architecture & Design

This Chess AI project is a single-page web application developed entirely in JavaScript using the React library. The chess.js library is employed to model the chess gameplay, allowing for rule enforcement, game state tracking, and move generation.

The AI system's logic, integrated directly into the client-side code, is underpinned by the minimax algorithm, a decision-making method often used in game theory and AI to find the optimal move in a zero-sum game. The efficiency of this algorithm is greatly improved by employing alpha-beta pruning, a method that disregards irrelevant branches in the game tree, allowing the algorithm to search deeper into the game tree in less time.

To further reduce the complexity, the AI system has been designed to consider only the top 30 most probable child nodes for each position during its search. This decision is guided by a deep learning model, trained using Python and TensorFlow and then converted to TensorFlow.js to be integrated into the web application. The network also serves as a method of breaking ties between nodes in the search tree with equal value accoriding to the heuristic function.

While the initial plan was to use a deep learning model for the heuristic function in the minimax algorithm, due to computational efficiency concerns, this idea was abandoned in favor of a simpler heuristic based on material advantage. Despite the simplification, the system remains highly effective and capable of challenging human players in real-time games.

The combination of these technologies and methodologies results in a performant and engaging Chess AI application that operates entirely in the browser, without the need for a separate backend server.

## Data Preprocessing
The AI is trained on a [Kaggle dataset](https://www.kaggle.com/datasets/datasnaek/chess) of chess games played on Lichess, with each game represented as a series of moves in Standard Algebraic Notation (SAN). The dataset was processed using Python's pandas and python-chess libraries to create a representation where each row corresponds to a specific move made in a game. 

The board positions were encoded into a 'bitboard' tensor with dimensions [8,8,12]. This format is a three-dimensional representation of the chessboard, with the first two dimensions corresponding to the spatial dimensions of the chessboard (i.e., the rows and columns), and the third dimension representing the type and color of the pieces (6 pieces * 2 colors). 

In the bitboard tensor, each cell essentially corresponds to a particular square on the board and a particular piece type/color. A cell is marked with '1' if the corresponding square on the chessboard is occupied by the respective piece, and '0' otherwise. This leads to the bitboard being mostly filled with zeros, except at positions where a particular chess piece exists, which are signified with a '1'.

In addition to the bitboard tensor, several other key features were extracted from each board position, including the turn number, the player whose turn it is (represented as a binary value), and the material scores for both players. The material score is a simple numerical representation of the player's remaining pieces on the board, calculated by assigning specific point values to each type of piece (for example, pawns are worth 1 point, knights and bishops 3 points, rooks 5 points, and queens 9 points).

## Neural Network Architecture
![model](https://github.com/samueltesfai/react-chess-app/assets/67299283/d11b03ea-cffe-4f9f-a0dd-6dd9f2ed85a9)

The neural networks are designed with a two-part structure: a Convolutional Neural Network (BoardEncoder) and a dense classifier (LinearClassifier). The input, a bitboard tensor of a board position, is passed through the CNN, flattened, then concatenated with the extracted features associated with that position. The resulting output is then processed by the dense classifier.

The CNN consists of three convolutional layers with 32, 64, and 128 filters, respectively, and uses padding to maintain the input size. Skip connections between these layers help maintain the gradient during backpropagation and improve performance.

The dense classifier has three layers with sizes of 1024, 512, and 256 neurons, respectively. Each of these layers in both the CNN and dense classifier is accompanied by a batch normalization and a dropout layer to prevent overfitting and enhance generalization.

The output of this architecture is further processed by a final dense layer. The size of this layer is either 1792 or 1, depending on the specific task at hand. The logic behind choosing 1792 as the output size for move prediction (instead of a seemingly more intuitive 64*63=4032) is grounded in the rules and restrictions of chess.

In chess, not all squares are reachable from all other squares. For example, a pawn can only move forward (with some conditions for diagonal capture), a bishop can only move along diagonals, etc. Therefore, the effective size of the output space needed for move prediction is significantly less than 4096.

However, for the game outcome prediction, the network only needs to predict a single probability (the probability of a win for the player to move), hence the final dense layer size of 1.

This architecture was pre-trained on predicting legal moves, teaching the network to understand the basic rules of chess. It was then fine-tuned for each specific downstream task.

## Results

The performance of the AI system demonstrates the efficacy of the chosen approach:

**Predicting the Next Move (Task 1)**
- Test Set Accuracy: 0.2327
- Precision: 0.5530
- Recall: 0.0866
- Top 3 Categorical Accuracy: 0.4233
- Top 5 Categorical Accuracy: 0.5232
- Top 10 Categorical Accuracy: 0.6616
- Top 20 Categorical Accuracy: 0.7902
- Top 30 Categorical Accuracy: 0.8570

**Predicting the Game Outcome (Task 2)**

On early moves (less than 26 half turns, but greater than 10 half turns):
- Test Set Accuracy: 0.9592
- Precision: 0.9588
- Recall: 0.9550

On mid to late game moves (greater than 25 half turns):
- Test Set Accuracy: 0.9966
- Precision: 0.9957
- Recall: 0.9974

Interestingly, due to the app's performance, a simple material advantage heuristic was used instead of the sophisticated deep learning model for determining the AI's moves. The high performing model's insights are used to narrow down the top 30 potential moves considered by the minimax algorithm. This approach delivers a robust and responsive app, with the AI demonstrating impressive gameplay. The success of this methodology suggests that further improvements might be made by focusing on enhancing the move prediction network, possibly by training multiple networks on different stages of the game, as was done for predicting the winner.

## Future Directions

This project lays a solid foundation for exploring advanced AI techniques in strategic games. Future work could include refining the AI's performance by training separate models for different stages of the game or expanding this methodology to other board games such as Go or Shogi.

## Conclusion

Through this project, we demonstrate how traditional game AI techniques can be combined with modern deep learning to build a Chess AI that can challenge human players. This work also provides a blueprint for researchers and developers interested in exploring this intersection of AI and games further.
