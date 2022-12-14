/* Node component, each node is represented as a grid cell */

import {Component} from 'react';
import './node.css';

export default class Node extends Component {
    render() {
        const { row, column, startNode, finishNode, wallNode, onMouseDown, onMouseEnter, onMouseOut, onMouseUp} = this.props;
        const nodeId = `node${row}-${column}`;
        const nodeType = startNode ? 'startNode' : finishNode ? 'finishNode' : wallNode ? 'wallNode' : '';
        let cellWidth = 25;
        let cellHeight = 25;

        return (
            <div 
                id={nodeId} 
                className={`Node ${nodeType}`}
                style={{ "--width": `${cellWidth}px`, "--height": `${cellHeight}px` }}
                onMouseDown={(event) => onMouseDown(event, row, column)}
                onMouseEnter={() => onMouseEnter(row, column)} 
                onMouseOut={() => onMouseOut(row, column)} 
                onMouseUp={(event) => onMouseUp(event)}
                onContextMenu={(event) => onMouseDown(event, row, column)}>
            </div>
        );
    }
}