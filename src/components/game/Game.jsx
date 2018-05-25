import React, { Component } from 'react';
import './Game.css'
import { Cell } from './cell/Cell'
import { CellState, pickRandomState } from './cell/CellState'
import hash from 'object-hash'

export class Game extends Component {
    state = {
        grid: null,
        gridHash: null,
        lastGridHash: null,
        iteration: 0,
        ended: false,
        endMessage: null
    }

    static defaultProps = {
        maxIterations: 1000,
        iterationInterval: 200,
        cellSize: 30,
        size: {
            width: parseInt(window.innerWidth, 10),
            height: parseInt(window.innerHeight, 10)
        }
    }

    componentWillMount() {
        this.initGrid()
    }

    componentDidMount() {
        this.start()
    }

    initGrid() {
        const grid = []
        const numberOfLines = parseInt(this.props.size.height / (this.props.cellSize + 2), 10) // + 2 is for the borders top and bottom of the cell
        const numberOfColumns = parseInt(this.props.size.width / (this.props.cellSize + 2), 10) // + 2 is for the borders left and right of the cell

        for (let i = 0; i < numberOfLines; i++) {
            grid[i] = []

            for (let j = 0; j < numberOfColumns; j++) {
                grid[i][j] = pickRandomState()
            }
        }

        this.setState({ grid })
    }

    start() {
        let iteration = 1;
        let iterationInterval = setInterval(() => {
            const grid = this.computeNextGeneration()
            const gridHash = hash(grid)
            let stopGame = false
            let endMessage = null

            if (this.isGameInInfiniteGenerations(gridHash) || this.isGameEnded(grid) || iteration >= this.props.maxIterations) {
                endMessage = 'Generation stopped (infinite)'
                stopGame = true
            } else if (this.isGameEnded(grid) || iteration >= this.props.maxIterations) {
                endMessage = 'Generation ended'
                stopGame = true
            } else {
                const lastGridHash = this.state.gridHash

                iteration++
                this.setState({ 
                    grid,
                    gridHash,
                    iteration,
                    lastGridHash
                })
            }

            if (stopGame) {
                clearInterval(iterationInterval)
                this.setState({
                    ended: true,
                    endMessage: endMessage
                })
            }
        }, this.props.iterationInterval)
    }

    isGameEnded(nextGrid) {
        return this.state.gridHash === hash(nextGrid)
    }

    isGameInInfiniteGenerations(nextGridHash) {
        return this.state.lastGridHash === nextGridHash
    }

    computeNextGeneration() {
        return this.state.grid.map((line, i) => line.map((state, j) => this.computeNextCellState(state, i, j)))
    }

    computeNextCellState(state, i, j) {
        let nextState = state
        const neighbours = [
            (this.state.grid[i-1] || [])[j-1], // top left
            (this.state.grid[i-1] || [])[j], // top center
            (this.state.grid[i-1] || [])[j+1], // top right

            (this.state.grid[i+1] || [])[j-1], // bottom left
            (this.state.grid[i+1] || [])[j], // bottom center
            (this.state.grid[i+1] || [])[j+1], // bottom right

            (this.state.grid[i] || [])[j-1], // left
            (this.state.grid[i] || [])[j+1] // right
        ]
        const numberOfAliveNeighbours = this.countNumberOfAliveCells(neighbours)

        if (state === CellState.ALIVE && (numberOfAliveNeighbours === 2 || numberOfAliveNeighbours === 3)) {
            nextState = CellState.ALIVE
        } else if (state === CellState.DEAD && numberOfAliveNeighbours === 3) {
            nextState = CellState.ALIVE
        } else {
            nextState = CellState.DEAD
        }

        return nextState
    }

    countNumberOfAliveCells(cells) {
        return cells.reduce((counter, state) => counter += Number(state === CellState.ALIVE), 0)
    }

    render() {
        return (
            <div>
                <div className="iteration-counter">{this.state.iteration}</div>
                {this.state.ended ? <div className="end-message">{this.state.endMessage}</div> : null}
                <div className="grid">
                    {this.state.grid.map((line, index) => (
                        <div key={index} className="grid-line">
                            {line.map((alive, index) => <Cell key={index} alive={alive} size={this.props.cellSize} />)}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}