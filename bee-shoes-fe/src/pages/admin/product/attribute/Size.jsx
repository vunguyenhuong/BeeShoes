import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Switch,
  Table,
  message,
  Tooltip
} from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import { ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";

function Size() {
  const [sizeList, setSizeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [statusSize, setStatusSize] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const { confirm } = Modal;
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [item, setItem] = useState("");

  const showModalAdd = () => {
    setIsModalAddOpen(true);
  };
  const handleCancelAdd = () => {
    setIsModalAddOpen(false);
  };

  const showModalUpdate = () => {
    setIsModalUpdateOpen(true);
  };
  const handleCancelUpdate = () => {
    setIsModalUpdateOpen(false);
  };

  useEffect(() => {
    if (isModalUpdateOpen === true) {
      formUpdate.setFieldsValue({
        name: item.name,
      });
    }
  }, [isModalUpdateOpen, formUpdate, item.name]);

  useEffect(() => {
    loadData(currentPage, pageSize, searchValue, statusSize);
  }, [currentPage, pageSize, searchValue, statusSize]);

  const loadData = (currentPage, pageSize, searchValue, statusSize) => {
    request
      .get("/size", {
        params: {
          name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          status: statusSize,
        },
      })
      .then((response) => {
        setSizeList(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      className: "text-center",
    },
    {
      title: "Số size",
      dataIndex: "name",
      key: "name",
      className: "text-center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      className: "text-center",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    // {
    //   title: "Hoạt động",
    //   dataIndex: "status",
    //   key: "status",
    //   className: "text-center",
    //   render: (x, item) => (
    //     <Switch
    //       className={!x ? "bg-warning" : ""}
    //       checkedChildren={<i class="fa-solid fa-check"></i>}
    //       unCheckedChildren={<i class="fa-solid fa-xmark"></i>}
    //       checked={!x}
    //       onChange={() => showDeleteConfirm(item)}
    //     />
    //   ),
    // },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "action",
      className: "text-center",
      render: (x, item) => (
        <>
         <Tooltip placement="top" title="Chỉnh sửa">
            <Link to={"/admin/size"}>
              <button
                type="primary"
                onClick={() => {
                  setItem(item);
                  showModalUpdate(item);
                }}
                className="btn btn-sm text-warning"
              >
                <i className="fas fa-edit"></i>
              </button>
            </Link>
          </Tooltip>
        </>
      ),
    },
  ];

  const showDeleteConfirm = (item) => {
    confirm({
      title: "Xác nhận ",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn sửa trạng thái hoạt động?",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .remove(`/size/${item.id}`)
          .then((response) => {
            if (response.status === 200) {
              loadData(currentPage, pageSize, searchValue, statusSize);
              toast.success("Thành công!");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleAdd = (data) => {
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn thêm size mới? ",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .post("/size", data)
          .then((response) => {
            if (response.status === 200) {
              console.log(response);
              toast.success("Thêm mới thành công!");
              setIsModalAddOpen(false);
              loadData(currentPage, pageSize, searchValue, statusSize);
              formAdd.resetFields();
            }
          })
          .catch((e) => {
            console.log(e);
            if (e.response.status === 500) {
              toast.error(e.response.data);
            }
            toast.error(e.response.data.message);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleUpdate = (data) => {
    confirm({
      title: "Xác nhận ",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn cập nhật số size? ",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .put(`/size/${item.id}`, data)
          .then((response) => {
            if (response.status === 200) {
              console.log(response);
              toast.success("Cập nhật thành công!");
              setIsModalUpdateOpen(false);
              loadData(currentPage, pageSize, searchValue, statusSize);
              formUpdate.resetFields();
            }
            setIsModalUpdateOpen(false);
          })
          .catch((e) => {
            console.log(e);
            if (e.response.status === 500) {
              toast.error(e.response.data);
            }
            toast.error(e.response.data.message);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <BaseUI>
      <h6 className="fw-semibold">Danh sách kích cỡ</h6>
      <Row gutter={10}>
        <Col span={13}>
          <label className="mb-1">Số size</label>
          <Input
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tìm kiếm số size..."
          />
        </Col>
        <Col span ={6}></Col>
        {/* <Col span={5}>
          <div className="mb-1">Trạng thái</div>
          <Radio.Group
            defaultValue={null}
            onChange={(event) => setStatusSize(event.target.value)}
          >
            <Radio value={null}>Tất cả</Radio>
            <Radio value={false}>Hoạt động</Radio>
            <Radio value={true}>Ngừng hoạt động</Radio>
          </Radio.Group>
        </Col> */}
        <Col span={4}>
          <div className="mb-1">‍</div>
          <Link to={"/admin/size"}>
            <Button
              type="primary"
              onClick={showModalAdd}
              className="bg-warning w-100"
            >
              <i className="fas fa-plus-circle me-1"></i>Thêm size
            </Button>
          </Link>
        </Col>
      </Row>
      <Table
        dataSource={sizeList}
        columns={columns}
        className="mt-3"
        pagination={{
          showSizeChanger: true,
          current: currentPage,
          pageSize: pageSize,
          pageSizeOptions: [5, 10, 20, 50, 100],
          showQuickJumper: true,
          total: totalPages * pageSize,
          onChange: (page, pageSize) => {
            setCurrentPage(page);
            setPageSize(pageSize);
          },
        }}
      />

      <Modal
        title="Thêm Size"
        open={isModalAddOpen}
        onCancel={handleCancelAdd}
        footer=""
      >
        <Form onFinish={handleAdd} layout="vertical" form={formAdd}>
          <Form.Item
            label={"Size"}
            name={"name"}
            rules={[
              { required: true, message: "Số size không được để trống!" },
            ]}
          >
            <Input placeholder="Nhập số size..." />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              <i className="fas fa-plus-circle me-1"></i> Thêm
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa size"
        open={isModalUpdateOpen}
        onCancel={handleCancelUpdate}
        footer=""
      >
        <Form onFinish={handleUpdate} layout="vertical" form={formUpdate}>
          <Form.Item
            label={"Size"}
            name={"name"}
            rules={[
              { required: true, message: "Số size không được để trống!" },
            ]}
          >
            <Input placeholder="Nhập số size..." />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              <i className="fas fa-plus-circle me-1"></i> Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>
    </BaseUI>
  );
}

export default Size;
