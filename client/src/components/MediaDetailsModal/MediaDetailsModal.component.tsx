import Modal from 'react-modal';

const MediaDetailsModal = () => {
  return (
    <Modal
      className='modal'
      overlayClassName='modal-overlay'
      isOpen={false}
      shouldCloseOnOverlayClick={true}
      contentLabel='Media Details Modal'
    ></Modal>
  );
};

export default MediaDetailsModal;
