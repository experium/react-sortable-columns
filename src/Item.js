import React, { Component } from 'react';

export default class Item extends Component {
    shouldComponentUpdate(nextProps) {
        return nextProps.id !== this.props.id
            || nextProps.row !== this.props.row;
    }

    render() {
        const { ItemTemplate, item, index } = this.props;

        return <ItemTemplate item={item} index={index} />;
    }
}
