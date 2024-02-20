import { ImageGalleryItem } from './ImageGalleryItem';
import { Gallery } from './ImageGallery.styled';

export const ImageGallery = ({ items, onClick }) => {
  return (
    <Gallery>
      {items.map(({ webformatURL, id, largeImageURL }) => {
        return (
          <ImageGalleryItem
            key={id}
            id={id}
            sourceImg={webformatURL}
            largeImg={largeImageURL}
            onClick={onClick}
          />
        );
      })}
    </Gallery>
  );
};
