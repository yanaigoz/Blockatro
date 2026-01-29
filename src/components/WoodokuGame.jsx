import React, { useState, useEffect } from 'react';

const WoodokuGame = () => {
  const GRID_SIZE = 5;
  const [board, setBoard] = useState(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
  const [activePieces, setActivePieces] = useState([]);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [displayScore, setDisplayScore] = useState(null);
  const [discardCount, setDiscardCount] = useState(2);
  const [rotateCount, setRotateCount] = useState(5);

  const pieces = [
    { id: 0, shape: [[1]] },
    { id: 1, shape: [[1, 1]] },
    { id: 2, shape: [[1], [1]] },
    { id: 3, shape: [[1, 0], [0, 1]] },
    { id: 4, shape: [[0, 1], [1, 0]] },
    { id: 5, shape: [[1, 1, 1]] },
    { id: 6, shape: [[1], [1], [1]] },
    { id: 7, shape: [[1, 1], [1, 0]] },
    { id: 8, shape: [[1, 1], [0, 1]] },
    { id: 9, shape: [[1, 0], [1, 1]] },
    { id: 10, shape: [[0, 1], [1, 1]] },
    { id: 11, shape: [[0, 0, 1], [0, 1, 0], [1, 0, 0]] },
    { id: 12, shape: [[1, 0, 0], [0, 1, 0], [0, 0, 1]] },
    { id: 13, shape: [[1, 1], [1, 1]] },
    { id: 14, shape: [[1, 1], [0, 1], [0, 1]] },
    { id: 15, shape: [[1, 1], [1, 0], [1, 0]] },
    { id: 16, shape: [[1, 1, 1], [0, 0, 1]] },
    { id: 17, shape: [[1, 1, 1], [1, 0, 0]] },
    { id: 18, shape: [[1, 0], [1, 0], [1, 1]] },
    { id: 19, shape: [[0, 1], [0, 1], [1, 1]] },
    { id: 20, shape: [[0, 0, 1], [1, 1, 1]] },
    { id: 21, shape: [[1, 0, 0], [1, 1, 1]] },
    { id: 22, shape: [[0, 1, 0], [1, 1, 1]] },
    { id: 23, shape: [[1, 1, 1], [0, 1, 0]] },
    { id: 24, shape: [[1, 0], [1, 1], [1, 0]] },
    { id: 25, shape: [[0, 1], [1, 1], [0, 1]] },
    { id: 26, shape: [[1, 0], [1, 1], [0, 1]] },
    { id: 27, shape: [[0, 1], [1, 1], [1, 0]] },
    { id: 28, shape: [[0, 1, 1], [1, 1, 0]] },
    { id: 29, shape: [[1, 1, 0], [0, 1, 1]] },
    { id: 30, shape: [[0, 1, 0], [1, 1, 1], [0, 1, 0]] },
    { id: 31, shape: [[1, 1, 1], [0, 1, 0], [0, 1, 0]] },
    { id: 32, shape: [[0, 0, 1], [1, 1, 1], [0, 0, 1]] },
    { id: 33, shape: [[0, 1, 0], [0, 1, 0], [1, 1, 1]] },
    { id: 34, shape: [[1, 0, 0], [1, 1, 1], [1, 0, 0]] },
    { id: 35, shape: [[1, 1, 1], [0, 0, 1], [0, 0, 1]] },
    { id: 36, shape: [[0, 0, 1], [0, 0, 1], [1, 1, 1]] },
    { id: 37, shape: [[1, 0, 0], [1, 0, 0], [1, 1, 1]] },
    { id: 38, shape: [[1, 1, 1], [1, 0, 0], [1, 0, 0]] },
    { id: 39, shape: [[1, 1, 1], [1, 0, 1]] },
    { id: 40, shape: [[1, 1], [1, 0], [1, 1]] },
    { id: 41, shape: [[1, 0, 1], [1, 1, 1]] },
    { id: 42, shape: [[1, 1], [0, 1], [1, 1]] },
    { id: 43, shape: [[0, 1, 1], [0, 1, 1], [0, 0, 1]] },
    { id: 44, shape: [[1, 1, 0], [1, 1, 0], [1, 0, 0]] },
    { id: 45, shape: [[0, 1, 1], [1, 1, 1]] },
    { id: 46, shape: [[1, 1, 0], [1, 1, 1]] },
    { id: 47, shape: [[1, 1, 1], [1, 1, 1]] },
    { id: 48, shape: [[1, 1], [1, 1], [1, 1]] }
  ];

  const colors = ['blue', 'green', 'red', 'yellow'];
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  };

  const getShapeBounds = (shape) => {
    let minRow = shape.length;
    let maxRow = 0;
    let minCol = shape[0].length;
    let maxCol = 0;

    for (let i = 0; i < shape.length; i++) {
      for (let j = 0; j < shape[i].length; j++) {
        if (shape[i][j] === 1) {
          minRow = Math.min(minRow, i);
          maxRow = Math.max(maxRow, i);
          minCol = Math.min(minCol, j);
          maxCol = Math.max(maxCol, j);
        }
      }
    }
    return { minRow, maxRow, minCol, maxCol };
  };

  const isValidPlacement = (row, col, piece) => {
    if (!piece) return false;

    const { minRow, maxRow, minCol, maxCol } = getShapeBounds(piece.shape);
    const height = maxRow - minRow + 1;
    const width = maxCol - minCol + 1;

    if (row + height > GRID_SIZE || col + width > GRID_SIZE) return false;

    for (let i = 0; i < piece.shape.length; i++) {
      for (let j = 0; j < piece.shape[i].length; j++) {
        if (piece.shape[i][j] === 1) {
          const boardRow = row + (i - minRow);
          const boardCol = col + (j - minCol);
          if (board[boardRow][boardCol] !== null) return false;
        }
      }
    }
    return true;
  };

  const placePiece = (row, col) => {
    if (selectedPieceIndex === null) return;
    const piece = activePieces[selectedPieceIndex];

    const { minRow, minCol } = getShapeBounds(piece.shape);
    const adjustedRow = row;
    const adjustedCol = col;

    if (!isValidPlacement(adjustedRow, adjustedCol, piece)) return;

    const newBoard = board.map(row => [...row]);
    for (let i = 0; i < piece.shape.length; i++) {
      for (let j = 0; j < piece.shape[i].length; j++) {
        if (piece.shape[i][j] === 1) {
          const boardRow = adjustedRow + (i - minRow);
          const boardCol = adjustedCol + (j - minCol);
          newBoard[boardRow][boardCol] = piece.color;
        }
      }
    }

    const newActivePieces = [...activePieces];
    newActivePieces.splice(selectedPieceIndex, 1);
    setBoard(newBoard);
    setActivePieces(newActivePieces);
    setSelectedPieceIndex(null);
    setDisplayScore(null);

    if (newActivePieces.length === 0) {
      setGameOver(true);
    }
  };

  const discardPiece = () => {
    if (selectedPieceIndex === null || discardCount <= 0) return;

    const newActivePieces = [...activePieces];
    const randomIndex = Math.floor(Math.random() * pieces.length);
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    newActivePieces[selectedPieceIndex] = {
      shape: JSON.parse(JSON.stringify(pieces[randomIndex].shape)),
      color: randomColor,
      id: pieces[randomIndex].id
    };

    setActivePieces(newActivePieces);
    setSelectedPieceIndex(null);
    setDiscardCount(discardCount - 1);
  };

  const rotatePiece = () => {
    if (selectedPieceIndex === null || rotateCount <= 0) return;

    const piece = activePieces[selectedPieceIndex];
    const rows = piece.shape.length;
    const cols = piece.shape[0].length;

    const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        rotated[j][rows - 1 - i] = piece.shape[i][j];
      }
    }

    const newActivePieces = [...activePieces];
    newActivePieces[selectedPieceIndex] = {
      ...piece,
      shape: rotated
    };

    setActivePieces(newActivePieces);
    setRotateCount(rotateCount - 1);
  };

  const calculateScore = () => {
    let points = 0;
    let details = [];

    const coveredTiles = board.flat().filter(cell => cell !== null).length;
    points += coveredTiles;
    details.push(`${coveredTiles} covered tiles: ${coveredTiles} points`);

    // Count complete rows
    let rowReport = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      const row = board[i];
      const filledCells = row.filter(cell => cell !== null);

      if (filledCells.length === GRID_SIZE) {
        const uniqueColors = new Set(filledCells);

        if (uniqueColors.size === 4 &&
            filledCells.includes('blue') &&
            filledCells.includes('red') &&
            filledCells.includes('green') &&
            filledCells.includes('yellow')) {
          points += 20;
          rowReport.push('all colors (+20)');
        } else if (uniqueColors.size === 1) {
          points += 10;
          rowReport.push('same color (+10)');
        } else {
          points += 5;
          rowReport.push('complete (+5)');
        }
      }
    }

    if (rowReport.length > 0) {
      details.push(`Complete rows: ${rowReport.join(', ')}`);
    }

    // Count complete columns
    let colReport = [];
    for (let j = 0; j < GRID_SIZE; j++) {
      const col = board.map(row => row[j]);
      const filledCells = col.filter(cell => cell !== null);

      if (filledCells.length === GRID_SIZE) {
        const uniqueColors = new Set(filledCells);

        if (uniqueColors.size === 4 &&
            filledCells.includes('blue') &&
            filledCells.includes('red') &&
            filledCells.includes('green') &&
            filledCells.includes('yellow')) {
          points += 20;
          colReport.push('all colors (+20)');
        } else if (uniqueColors.size === 1) {
          points += 10;
          colReport.push('same color (+10)');
        } else {
          points += 5;
          colReport.push('complete (+5)');
        }
      }
    }

    if (colReport.length > 0) {
      details.push(`Complete columns: ${colReport.join(', ')}`);
    }

    setDisplayScore(`Total score: ${points} points\n${details.join('\n')}`);
  };

  useEffect(() => {
    if (activePieces.length === 0 && !gameOver) {
      const initialPieces = Array(5).fill().map(() => {
        const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
        return {
          shape: JSON.parse(JSON.stringify(randomPiece.shape)),
          color: colors[Math.floor(Math.random() * colors.length)],
          id: randomPiece.id
        };
      });
      setActivePieces(initialPieces);
    }
  }, [activePieces.length, gameOver]);

  const resetGame = () => {
    setBoard(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null)));
    setActivePieces([]);
    setSelectedPieceIndex(null);
    setGameOver(false);
    setDisplayScore(null);
    setDiscardCount(2);
    setRotateCount(5);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={calculateScore}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Score
        </button>
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Play Again
        </button>
        <button
          onClick={discardPiece}
          disabled={selectedPieceIndex === null || discardCount <= 0}
          className={`px-4 py-2 rounded ${
            selectedPieceIndex !== null && discardCount > 0
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Discard ({discardCount})
        </button>
        <button
          onClick={rotatePiece}
          disabled={selectedPieceIndex === null || rotateCount <= 0}
          className={`px-4 py-2 rounded ${
            selectedPieceIndex !== null && rotateCount > 0
              ? 'bg-purple-500 hover:bg-purple-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Rotate ({rotateCount})
        </button>
      </div>

      {displayScore && (
        <div className="text-xl font-bold whitespace-pre-line">{displayScore}</div>
      )}

      <div className="grid grid-cols-5 gap-1 bg-gray-200 p-2">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-12 h-12 ${cell ? colorClasses[cell] : 'bg-white'}
                border border-gray-300 cursor-pointer`}
              onClick={() => placePiece(rowIndex, colIndex)}
            />
          ))
        ))}
      </div>

      <div className="mt-4">
        <div className="text-lg font-semibold mb-2">Available Pieces:</div>
        <div className="flex gap-4 flex-wrap justify-center">
          {activePieces.map((piece, pieceIndex) => (
            <div
              key={pieceIndex}
              className={`flex flex-col gap-0.5 bg-gray-100 p-2 cursor-pointer
                ${selectedPieceIndex === pieceIndex ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedPieceIndex(pieceIndex)}
            >
              {piece.shape.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-0.5">
                  {row.map((cell, colIndex) => (
                    <div
                      key={`preview-${rowIndex}-${colIndex}`}
                      className={`w-8 h-8 ${cell ? colorClasses[piece.color] : 'bg-transparent'}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {gameOver && (
        <div className="text-xl font-bold text-red-500">Game Over!</div>
      )}
    </div>
  );
};

export default WoodokuGame;
