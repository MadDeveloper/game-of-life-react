import React, { Component } from 'react'
import './Cell.css'

export class Cell extends Component {
    static defaultProps = {
        alive: false,
        size: 30
    }

    render() {
        let className = 'cell'

        if (this.props.alive) {
            className += ' alive'
        }
        
        return (
            <div className={className} style={{ height: this.props.size }} />
        )
    }
}