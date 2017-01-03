import React, { Component } from 'react';
import { connect } from 'react-redux';
import File from '../File';
import './Tree.scss';

class Tree extends Component {

  renderFile ({ name, status }) {
    return <div className='tree__item-inner'>
      <div className='tree__file-branch' />
      <div className='tree__item-name'>
        <File name={name} status={status} />
      </div>
    </div>;
  }

  renderDirectory ({ name, children }, nestLevel) {
    return <div>
      <div className='tree__item-inner'>
        <div className='tree__directory-branch' />
        <div className='tree__item-name'>
          {name}
        </div>
      </div>
      {this.renderRecursively(children, nestLevel + 1)}
    </div>;
  }

  renderRecursively (items = [], nestLevel = 0) {
    return items.map((item, index) => {
      return <div key={index} className='tree__item'>
        {item.children ? this.renderDirectory(item, nestLevel) : this.renderFile(item)}
      </div>;
    });
  }

  render () {
    return (
      <div className='tree'>
        {this.renderRecursively(this.props.tree)}
      </div>
    );
  }
}

export default connect(({ tree }) => {
  return { tree };
})(Tree);
