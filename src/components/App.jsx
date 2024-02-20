import React, { Component } from 'react';
import isPropValid from '@emotion/is-prop-valid';
import { StyleSheetManager } from 'styled-components';

import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';
import { Loader } from './Loader/Loader';
import { fetchImages } from './api';

export class App extends Component {
  state = {
    pictures: [],
    query: '',
    page: 1,
    status: '',
    isLoading: false,
    isModalVisible: false,
    modalImage: { url: '', alt: '' },
    totalHits: 0,
  };

  shouldForwardProp(propName, target) {
    if (typeof target === 'string') {
      return isPropValid(propName);
    }
    return true;
  }

  async componentDidUpdate(prevProps, prevState) {
    const { page, query } = this.state;

    if (this.state.query !== prevState.query) {
      this.setState({ pictures: [], page: 1, status: 'pending', totalHits: 0 });
      try {
        let result = await fetchImages(query, page);
        console.log(result.hits);
        if (result.hits.length === 0) {
          this.setState({ status: 'rejected' });
          throw new Error('something went wrong');
        }
        this.setState({
          pictures: [...result.hits],
          status: 'resolved',
          totalHits: result.totalHits,
        });
      } catch (error) {
        console.log(error);
        this.setState({ status: 'rejected' });
      }
    }
  }

  onBtnClick = async () => {
    const { page, query } = this.state;
    this.setState({ isLoading: true });

    try {
      let result = await fetchImages(query, page + 1);
      console.log(result.hits);
      this.setState(prevState => {
        return {
          pictures: [...prevState.pictures, ...result.hits],
          page: prevState.page + 1,

          isLoading: false,
        };
      });
    } catch (error) {
      console.log(error);
      this.setState({ status: 'rejected', isLoading: false });
    }
  };

  addPictures = ({ query }) => {
    this.setState({ query: query });
  };
  onImageClick = (imageUrl, imageAlt) => {
    this.setState({
      isModalVisible: true,
      modalImage: { url: imageUrl, alt: imageAlt },
    });
  };
  closeModal = () => {
    this.setState({ isModalVisible: false });
  };
  render() {
    const { pictures, status, isLoading, totalHits, page } = this.state;
    const loadMore = page < Math.ceil(totalHits / 12);
    return (
      <StyleSheetManager shouldForwardProp={this.shouldForwardProp}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: ' 100vh',
            marginBottom: '80px',
            paddingTop: '50px',
          }}
        >
          <Modal
            isVisible={this.state.isModalVisible}
            imageUrl={this.state.modalImage.url}
            alt={this.state.modalImage.alt}
            onClose={this.closeModal}
          />
          <Searchbar onSubmit={this.addPictures} />
          {status === 'rejected' && <div>Something went wrong</div>}
          {status === 'pending' && (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Loader />
            </div>
          )}
          {status === 'resolved' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                marginBottom: '20px',
              }}
            >
              <ImageGallery items={pictures} onClick={this.onImageClick} />
              {isLoading && (
                <div style={{ marginBottom: '20px' }}>
                  <Loader />
                </div>
              )}
              {loadMore && <Button onLoadMoreBtnClick={this.onBtnClick} />}
            </div>
          )}
        </div>
      </StyleSheetManager>
    );
  }
}
