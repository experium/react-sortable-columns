import React, { PureComponent } from 'react';

export default class Item extends PureComponent {
    render() {
        const { ItemTemplate, ...props } = this.props;

        return <ItemTemplate {...props} />;
    }
}
