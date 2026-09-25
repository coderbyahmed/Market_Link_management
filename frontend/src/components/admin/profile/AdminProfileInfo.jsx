import { useState } from "react";
import { Modal, Form, Input } from "antd";
import { FaUser, FaEnvelope, FaPhoneAlt, FaUserShield, FaUserCheck } from "react-icons/fa";
import { showSuccess, showError } from "../../common/feedback/MessageProvider.jsx";
import Button from "../../common/Button.jsx";

const AdminProfileInfo = ({ profile, open, onOpen, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const handleOpenChange = (visible) => {
    if (visible) {
      form.setFieldsValue({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
      });
    }
  };

  const handleSave = async () => {
    if (saving) return;

    try {
      const values = await form.validateFields();

      setSaving(true);

      await onSave({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: (values.phone || "").trim(),
      });

      form.resetFields();
      onClose();
      showSuccess("Profile Updated Successfully");
    } catch (error) {
      if (error?.message) {
        showError(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const rows = [
    { label: "Full Name", value: profile.name, icon: FaUser },
    { label: "Email Address", value: profile.email, icon: FaEnvelope },
    { label: "Phone Number", value: profile.phone, icon: FaPhoneAlt },
    { label: "Role", value: profile.role, icon: FaUserShield },
    { label: "Account Status", value: profile.status, icon: FaUserCheck },
  ];

  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
          Personal Information
        </h2>
        <Button onClick={onOpen} variant="outline" size="sm">
          Edit Profile
        </Button>
      </div>

      <ul className="mt-5 divide-y divide-stone-100 dark:divide-stone-800">
        {rows.map(({ label, value, icon: Icon }) => (
          <li key={label} className="flex items-center gap-4 py-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-stone-400 dark:text-stone-500">
                {label}
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-stone-800 dark:text-stone-200">
                {value}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <Modal
        title="Edit Profile"
        open={open}
        onCancel={onClose}
        onOk={handleSave}
        afterOpenChange={handleOpenChange}
        okText="Save Changes"
        cancelText="Cancel"
        okButtonProps={{ loading: saving }}
        destroyOnHidden
        centered
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, whitespace: true, message: "Please enter your full name" },
              { min: 2, max: 60, message: "Full name must be between 2 and 60 characters" },
            ]}
          >
            <Input prefix={<FaUser className="text-stone-400" />} placeholder="Enter full name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, whitespace: true, message: "Please enter your email address" },
              { type: "email", message: "Enter a valid email address" },
            ]}
          >
            <Input
              prefix={<FaEnvelope className="text-stone-400" />}
              placeholder="Enter email address"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                pattern: /^[0-9+\-()\s.]{6,20}$/,
                message: "Phone number must contain only digits, spaces, and + - ( ) characters",
              },
            ]}
          >
            <Input
              prefix={<FaPhoneAlt className="text-stone-400" />}
              placeholder="Optional phone number"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProfileInfo;