import { Button, Modal } from 'antd'
import React from 'react'
import { useState } from 'react';
import { FaBug, FaRegCalendar, FaRegCalendarCheck, FaRegFileAlt, FaTruck } from 'react-icons/fa';
import { GiConfirmed } from 'react-icons/gi';
import { MdOutlineConfirmationNumber } from 'react-icons/md';

function BillHistory({props}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
    <Button type='primary' onClick={showModal} danger>
        Chi tiết
      </Button>
      <Modal title="Chi tiết" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer="" width={700}>
        {props.map((item,index)=>(
          <p className='my-4'>
            <span className='px-4 py-2 text-white rounded-2 me-3' style={{backgroundColor: "#2DC255"}}>
            {item.status === 0
            ? <FaRegFileAlt/>
            : item.status === 1
            ? <FaRegFileAlt/>
            : item.status === 2
            ? <MdOutlineConfirmationNumber/>
            : item.status === 3
            ? <FaRegCalendar/>
            : item.status === 4
            ? <FaRegCalendarCheck/>
            : item.status === 5
            ? <FaTruck/>
            : item.status === 6
            ? <GiConfirmed/>
            : item.status === 7
            ? <FaBug/>
            : <FaBug/>}
              </span> <span className='fw-semibold'>{item.note}</span> - Nhân viên xác nhận: {item.createBy}</p>
        ))}
      </Modal>
    </>
  )
}

export default BillHistory