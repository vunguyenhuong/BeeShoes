import { Button } from "antd";
import React, { useEffect, useState } from "react";
import QrReader from 'react-qr-scanner';

function QrCode({ title, onQrSuccess }) {
  const [delay, setDelay] = useState(1000);
  const [result, setResult] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const handleToggleCamera = () => {
    setIsCameraOn((prevState) => !prevState);
  };

  const handleScan = (data) => {
    setResult(data);
  };

  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 260,
    transform: "scaleX(-1)"
  };

  const processResult = () => {
    if (result) {
      console.log("Kết quả:", result.text);
      onQrSuccess(result.text);
      // Thực hiện các hành động khác với `result.text`
    }
  };

  useEffect(() => {
    processResult();
  }, [result]);

  return (
    <div className="">
      <Button type="primary" className="bg-success"
        data-bs-toggle="modal"
        data-bs-target="#modalId"
        onClick={handleToggleCamera}>
        <i className="fa-solid fa-qrcode me-1"></i> {title}
      </Button>
      <div
        className="modal fade"
        id="modalId"
        tabindex="-1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        role="dialog"
        aria-labelledby="modalTitleId"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-sm"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="modalTitleId">
                QR CODE CAMERA
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleToggleCamera}
              ></button>
            </div>
            <div className="modal-body">
              {isCameraOn && (
                <QrReader
                  delay={delay}
                  style={previewStyle}
                  onError={handleError}
                  onScan={handleScan}
                />
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
                onClick={handleToggleCamera}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QrCode;
