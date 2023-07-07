import Modal from 'react-modal';

interface Props {
  isOpen: boolean;
  confirmText: string;
  handleClick: Function;
}

const ConfirmModal: React.FC<Props> = ({
  isOpen,
  confirmText,
  handleClick,
}) => {
  return (
    <Modal
      className='Modal ConfirmModal'
      overlayClassName='Modal__Overlay'
      isOpen={isOpen}
      onRequestClose={() => handleClick(false)}
      shouldCloseOnOverlayClick={true}
      contentLabel='New List Modal'
    >
      <div className='ConfirmModal__Text'>{confirmText}</div>
      <div className='ConfirmModal__Buttons'>
        <button
          className='PrimaryButton--red'
          onClick={() => handleClick(true)}
        >
          Confirm
        </button>
        <button onClick={() => handleClick(false)}>Cancel</button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
