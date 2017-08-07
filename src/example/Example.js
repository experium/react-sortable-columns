import React, { Component } from 'react';
import times from 'lodash/times';

import './example.css';
import '../lib/style.css';
import Columns from '../lib/Columns.js';

var data = [];
times(45, item => data.push({ id: item, name: 'Item ' + item}));

export default class Example extends Component {
    state = {
        data
    }

    updateState = (newOrder) => {
        this.setState({ data: newOrder });
    }

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
                    itemTemplate={(item, index) => (
                        <div className="item">
                            <input
                                type="checkbox"
                                defaultChecked={item.id === 1}
                                value={item.id}
                            />
                            {item.name} {index}
                        </div>
                    )}
                    onChange={this.updateState}
                />
            </div>
        );
    }
}
