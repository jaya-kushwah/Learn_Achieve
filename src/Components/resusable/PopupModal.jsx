import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaExclamation } from 'react-icons/fa';

const PopupModal = ({ show, onHide, onConfirm }) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" animation>
      <div className="text-center px-4 py-4">
        <div className="pulse-warning mx-auto mb-3">
          <FaExclamation size={32} color="#ff9900" className="pulse-warning-icon" />
        </div>
        <h5 className="fw-bold mb-3">
          Are you sure you want to<br />change the status?
        </h5>
        <div className="d-flex justify-content-center gap-3">
          <Button
            variant="light"
            onClick={onHide}
            style={{ backgroundColor: '#ccc', color: '#000', minWidth: '80px' }}
          >
            No
          </Button>
          <Button variant="danger" onClick={onConfirm} style={{ minWidth: '80px' }}>
            Yes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PopupModal;
