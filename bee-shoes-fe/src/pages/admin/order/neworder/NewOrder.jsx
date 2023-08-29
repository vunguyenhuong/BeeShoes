import { Modal, Tabs, message } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import QrCode from "~/components/QrCode";
import * as request from "~/utils/httpRequest";
import OrderItem from "./OrderItem";
import Loading from "~/components/Loading/Loading";

function NewOrder() {
  const [listOrder, setListOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadOrders();
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const loadOrders = () => {
    request
      .get(`bill/staff/4`)
      .then((response) => {
        setListOrder(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleCreate = () => {
    request
      .post("/bill", {})
      .then((response) => {
        if (response.status === 201) {
          message.success("Tạo mới thành công");
          loadOrders();
        }
      })
      .catch((e) => {
        if (e.response.status === 411) {
          message.error("Chỉ được tạo tối đa 5 đơn hàng!");
        }
      });
  };

  const handleDelete = (key) => {
    const idBill = listOrder[key].id;
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: `Xác nhận xóa đơn hàng ${listOrder[key].code}?`,
      okText: "Ok",
      cancelText: "Cancel",
      onOk: async () => {
        request.remove(`/bill/${idBill}`).then(response=>{
          console.log(response);
          message.success("Xóa thành công!");
          loadOrders();
        }).catch(e=>{
          console.log(e);
        })
      },
    });
  }

  if(loading){
    return (
      <>
      <Loading></Loading>
      </>
    )
  }

  return (
    <>
      <div className="d-flex">
        <div className="flex-grow-1">
          <button
            type="button"
            class="btn btn-warning btn-sm"
            onClick={() => handleCreate()}
          >
            Tạo mới đơn hàng
          </button>
        </div>
        <div className="">
          
        </div>
      </div>
      <div className="mt-3">
        <Tabs hideAdd type="editable-card" onEdit={handleDelete}>
          {listOrder.map((order, index) => (
            <Tabs.TabPane key={index} tab={`${order.code}`}>
              <OrderItem props={order} index={index+1} onSuccess={loadOrders}/>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </>
  );
}

export default NewOrder;
