import { Button, Tabs } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import * as request from "~/utils/httpRequest";
import OrderItem from "./OrderItem";
import Loading from "~/components/Loading/Loading";
import { toast } from "react-toastify";
import { getTokenEmpoloyee } from "~/helper/useCookies";
import { jwtDecode } from "jwt-decode";

function NewOrder() {
  const [listOrder, setListOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waitCreate, setWaitCreate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadOrders();
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const loadOrders = () => {
    request.get(`/bill/new-bill`, {
      params: {
        idStaff: jwtDecode(getTokenEmpoloyee()).id,
        status: 1
      }
    }).then((response) => {
      setListOrder(response);
      console.log(response);
    }).catch((e) => {
      console.log(e);
    });
  };

  const handleCreate = () => {
    setWaitCreate(true);
    const timeout = setTimeout(async () => {
      try {
        await request.post("/bill", {}).then((response) => {
          if (response.status === 200) {
            toast.success("Tạo mới thành công");
            loadOrders();
          }
        }).catch((e) => {
          toast.error(e.response.data);
        });
        setWaitCreate(false);
      } catch (e) {

      }
    }, 500);
    return () => clearTimeout(timeout);
  };

  // const handleDelete = (key) => {
  //   const idBill = listOrder[key].id;
  //   Modal.confirm({
  //     title: "Xác nhận",
  //     maskClosable: true,
  //     content: `Xác nhận xóa đơn hàng ${listOrder[key].code}?`,
  //     okText: "Xác nhận",
  //     cancelText: "Hủy",
  //     onOk: async () => {
  //       request.remove(`/bill/${idBill}`).then(response => {
  //         console.log(response);
  //         message.success("Xóa thành công!");
  //         loadOrders();
  //       }).catch(e => {
  //         console.log(e);
  //       })
  //     },
  //   });
  // }

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <>
      <div className="d-flex">
        <div className="flex-grow-1">
          <Button onClick={() => handleCreate()} className="bg-warning text-dark" type="primary" loading={waitCreate}>Tạo mới đơn hàng</Button>
        </div>
        <div className="">
        </div>
      </div>
      <div className="mt-3">
        <Tabs>
          {listOrder.length > 0 && listOrder.map((order, index) => (
            <Tabs.TabPane key={order.code} tab={`${order.code}`}>
              <OrderItem props={order} index={index + 1} onSuccess={loadOrders} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    </>
  );
}

export default NewOrder;
