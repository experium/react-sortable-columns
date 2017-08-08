import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Motion, spring } from 'react-motion';
import keys from 'lodash/keys';

const {
    clamp,
    toColumns,
    calculateVisiblePositions,
    reinsert,
    springSetting,
    itemStyles
} = require('./helpers');

export default class Columns extends Component {
    static propTypes = {
        initialList: PropTypes.array.isRequired,
        columns: PropTypes.number,
        fixed: PropTypes.bool,
        itemTemplate: PropTypes.func.isRequired,
        onChange: PropTypes.func
    }

    constructor(props) {
        super(props);
        const { initialList, columns : columnsCount } = props;

        this.data = initialList;
        const data = keys(initialList);
        const columns = toColumns(data, columnsCount);

        this.state = {
            mouse: [0, 0],
            delta: [0, 0],
            lastPress: null,
            currentColumn: null,
            isPressed: false,
            isResizing: false,

            columns,
        };
    }

    componentWillMount() {
        this.resizeTimeout = null;
        this.layout = calculateVisiblePositions(
            this.state.columns,
            this.props.width,
            this.props.height
        );
    }

    addEventListeners() {
        window.addEventListener('touchmove', this.handleTouchMove);
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('touchend', this.handleMouseUp);
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    removeEventListeners() {
        window.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('touchend', this.handleMouseUp);
        window.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleTouchStart = (key, currentColumn, pressLocation, e) => {
        this.handleMouseDown(key, currentColumn, pressLocation, e.touches[0]);
    }

    handleTouchMove = (e) => {
        e.preventDefault();
        this.handleMouseMove(e.touches[0]);
    }

    handleMouseMove = ({pageX, pageY}) => {
        const { width, height, fixed, columns : columnsNumber } = this.props;
        const { columns, lastPress, currentColumn: colFrom, isPressed, delta: [dx, dy] } = this.state;
        var newColumns = columns;

        if (isPressed) {
            const mouse = [pageX - dx, pageY - dy];
            const colTo = clamp(Math.floor((mouse[0] + (width / 2)) / width), 0, 2);
            const rowTo = clamp(Math.floor((mouse[1] + (height / 2)) / height), 0, 100);
            const rowFrom = columns[colFrom].indexOf(lastPress);

            const couldReinsert = rowFrom !== -1 && columns[colTo];

            if (couldReinsert) {
                newColumns = reinsert(
                    columns,
                    colFrom, rowFrom, colTo, rowTo,
                    columnsNumber, fixed
                );
            }

            this.layout = calculateVisiblePositions(newColumns, width, height);

            this.setState({
                moved: true,
                mouse,
                columns: newColumns,
                currentColumn: couldReinsert ? colTo : colFrom
            });
        }
    }

    handleMouseDown = (key, currentColumn, [pressX, pressY], {pageX, pageY}) => {
        this.addEventListeners();

        this.setState({
            lastPress: key,
            currentColumn,
            isPressed: true,
            delta: [pageX - pressX, pageY - pressY],
            mouse: [pressX, pressY],
        });
    }

    handleMouseUp = () => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(this.state.columns);
        }

        this.setState({
            moved: false,
            isPressed: false,
            delta: [0, 0]
        });

        this.removeEventListeners();
    }

    render() {
        const { columns, lastPress, currentColumn, isPressed, mouse, moved, isResizing } = this.state;
        const { width, height, itemTemplate } = this.props;
        const { data, layout } = this;

        const maxHeight = height * columns.reduce((max, { length }) => length > max ? length : max, 0);

        return (
            <div className="react-columns-items" ref={node => this.items = node} style={{ height: maxHeight }}>
                { columns.map( (column, colIndex) =>
                    column.map( (row) => {
                        let style,
                            x,
                            y,
                            visualPosition = columns[colIndex].indexOf(row),
                            isActive = (row === lastPress && colIndex === currentColumn && isPressed && moved);

                        if (isActive) {
                            [x, y] = mouse;
                            style = {
                                translateX: x,
                                translateY: y
                            };
                        } else if(isResizing) {
                            [x, y] = layout[colIndex][visualPosition];
                            style = {
                                translateX: x,
                                translateY: y
                            };
                        } else {
                            [x, y] = layout[colIndex][visualPosition];
                            style = {
                                translateX: spring(x, springSetting),
                                translateY: spring(y, springSetting)
                            };
                        }

                        return (
                            <Motion key={row} style={style}>
                                {({ translateX, translateY }) => (
                                    <div
                                        onMouseDown={this.handleMouseDown.bind(null, row, colIndex, [x, y])}
                                        onTouchStart={this.handleTouchStart.bind(null, row, colIndex, [x, y])}
                                        className={isActive ? 'react-columns-item react-columns-item-active' : 'react-columns-item'}
                                        style={{
                                            ...itemStyles,
                                            width,
                                            height,
                                            WebkitTransform: `translate3d(${translateX}px, ${translateY}px, 0))`,
                                            transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
                                            zIndex: (row === lastPress && colIndex === currentColumn) ? 99 : visualPosition,
                                        }}
                                    >
                                        { itemTemplate(data[row], row) }
                                    </div>
                                )}
                            </Motion>
                        );
                    })
                )}
            </div>
        )
    }
}
