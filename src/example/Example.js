import React, { Component } from 'react';
import times from 'lodash/times';

import './example.css';
import Columns from '../Columns.js';

var initialData = [];
times(10, item => initialData.push({ id: item, name: 'Item ' + item}));

export default class Example extends Component {
    state = {
        data: initialData,
        checked: false
    }

    setChecked = () => {
        this.setState({
            checked: !this.state.checked
        });
    }

    updateState = (newOrder) => {
        this.setState({ data: newOrder });
    }

    renderItem = ({ item, index }) => (
        <div className="item">
            <input
                type="checkbox"
                checked={this.state.checked}
                value={item.id}
            />
            {item.name} {index}
            { console.log(index) }
        </div>
    );

    render() {
        const { data, checked } = this.state;

        return (
            <div>
                <button onClick={() => this.updateState(initialData)}>Set initial</button>
                <div className="modal">
                    <Columns
                        list={data}
                        getKey={item => item.id}
                        params={checked}
                        columns={2}
                        fixed={true}
                        width={230}
                        height={30}
                        ItemTemplate={this.renderItem}
                        onChange={this.updateState}
                    />
                </div>
            </div>
        );
    }
}
