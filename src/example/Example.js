import React, { Component } from 'react';
import times from 'lodash/times';

import './example.css';
import Columns from '../Columns.js';

var data = [];
times(55, item => data.push({ id: item, name: 'Item ' + item}));

export default class Example extends Component {
    state = {
        data
    }

    updateState = (newOrder) => {
        this.setState({ data: newOrder });
    }

    renderItem = ({ item, index }) => (
        <div className="item">
            <input
                type="checkbox"
                defaultChecked={this.state.data[index].id === 1}
                value={item.id}
            />
            {this.state.data[index].name}
            {index + 1}
            { console.log( index) || null }
        </div>
    );

    render() {
        const { data } = this.state;

        return (
            <div className="modal">
                <Columns
                    initialList={data}
                    columns={2}
                    fixed={true}
                    width={230}
                    height={30}
                    ItemTemplate={this.renderItem}
                    onChange={this.updateState}
                />
            </div>
        );
    }
}
