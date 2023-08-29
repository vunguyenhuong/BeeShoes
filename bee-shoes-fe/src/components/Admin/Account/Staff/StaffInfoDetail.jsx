import { Button, Col, Divider, Form, Input, Radio, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Loading from "~/components/Loading/Loading";
import * as request from "~/utils/httpRequest";

function StaffInfoDetail({ idStaff }) {
  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState(null);
  //  new

  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const handleImageSelect = (event) => {
    try {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setAvatar(file);
    } catch (e) {
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      request
        .get(`/staff/${idStaff}`)
        .then((response) => {
          setStaff(response);
          form.setFieldsValue({
            username: response.username,
            cccd: response.cccd,
            name: response.name,
            birthday: response.birthday,
            gender: response.gender,
            email: response.email,
            phoneNumber: response.phoneNumber
          });
        })
        .catch((e) => {
          console.log(e);
        });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [idStaff]);

  if (loading) {
    return (
      <>
        <Loading />
      </>
    );
  }

  return (
    <>
      
    </>
  );
}

export default StaffInfoDetail;
