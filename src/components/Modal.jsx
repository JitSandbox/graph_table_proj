/* eslint-disable react/prop-types */
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

function ModalLaunch(props) {
  const { launch, isOpen, toggle } = props;
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Launch Summary</ModalHeader>
      <ModalBody>
        <p>
          <strong>Title:</strong> {launch.Title}
        </p>
        <p>
          <strong>Details:</strong> {launch.Details}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalLaunch;
