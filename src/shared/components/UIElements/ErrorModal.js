import Button from '../FormElements/Button';
import Modal from './Modal';

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header='An Error Occured!'
      show={!!props.error}
      footer={<Button onClick={props.onClear}>Okay</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
