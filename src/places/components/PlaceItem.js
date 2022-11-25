import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import { useState, useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const PlaceList = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { key, id, image, title, description, address, creator, location } =
    props;
  console.log('PlaceItem props : ', props);

  const auth = useContext(AuthContext);
  console.log('UID: ', auth.userId);
  console.log('Same ID: ', creator == auth.userId);
  const [isShowMap, setIsShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);

    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
      );
      props.onDelete(id);
    } catch (err) {}
    console.log('deleting...');
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={isShowMap}
        onCancel={cancelDeleteHandler}
        header={address}
        contentClass='place-item__modal-content'
        footerClass='place-item__modal-actions'
        footer={<Button onClick={() => setIsShowMap(false)}>CLOSE</Button>}
      >
        <div className='map-container'>
          <Map center={location} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={() => setShowConfirmModal(false)}
        header='Are you sure?'
        footerClass='place-item__modal-actions'
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>Do you want to proceed?</p>
      </Modal>
      <li className='place-item'>
        <Card className='place-item__content'>
          {isLoading && <LoadingSpinner />}
          <div className='place-item__image'>
            <img src={image} alt={title} />
          </div>
          <div className='place-item__info'>
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className='place-item__actions'>
            <Button inverse onClick={() => setIsShowMap(true)}>
              VIEW ON MAP
            </Button>
            {auth.userId === creator && (
              <>
                <Button to={`/places/${props.id}`}>EDIT</Button>
                <Button danger onClick={() => setShowConfirmModal(true)}>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default PlaceList;
