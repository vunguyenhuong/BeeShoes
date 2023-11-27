import { Button, Form, InputNumber, Modal } from "antd";

export default function ModalQuantityGiveBack({
  visible,
  onCancel,
  handleSusses,
}) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const quantity = values.quantityCustom;
        handleSusses(quantity);
        onCancel();
      })
      .catch(() => {});
  };

  return (
    <Form
      form={form}
      labelCol={{
        span: 5,
      }}
      wrapperCol={{
        span: 16,
      }}
    >
      <Modal
        title="Số lượng trả hàng"
        visible={visible}
        onOk={handleOk}
        onCancel={onCancel}
        style={{ borderRadius: "10px" }}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Trả hàng
          </Button>,
        ]}
      >
        <Form.Item
          label="Số lượng"
          name="quantityCustom"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập số lượng!",
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={1} />
        </Form.Item>
      </Modal>
    </Form>
  );
}
