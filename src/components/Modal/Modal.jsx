import { Overlay, ModalWin } from './Modal.styled';

import React, { Component } from 'react';

export class Modal extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = e => {
    if (e.key === 'Escape') {
      this.props.onClose();
    }
  };

  render() {
    const { isVisible, imageUrl, alt, onClose } = this.props;
    return (
      <Overlay isVisible={isVisible} onClick={onClose}>
        <ModalWin onClick={e => e.stopPropagation()}>
          <img src={imageUrl} alt={alt} />
        </ModalWin>
      </Overlay>
    );
  }
}
