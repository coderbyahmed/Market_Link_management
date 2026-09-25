import { useState } from "react";
import { Modal, Form, Input } from "antd";
import { FaKey, FaLock } from "react-icons/fa";
import { showSuccess, showError } from "../../common/feedback/MessageProvider.jsx";
import Button from "../../common/Button.jsx";
import { changeAdminPassword } from "../../../services/adminProfile.service.js";

const AdminSecurity = () => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const confirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("newPassword") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match"));
    },
  });

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      setSaving(true);

      await changeAdminPassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      form.resetFields();
      setOpen(false);
      showSuccess("Password Updated Successfully");
    } catch (error) {
      if (error?.message) {
        showError(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <h2 className="font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
        Account Security
      </h2>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 p-4 dark:border-stone-800">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-stone-500 dark:bg-stone-800 dark:text-stone-400">
            <FaKey className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
              Password
            </p>
            <p className="mt-0.5 text-sm tracking-widest text-stone-400 dark:text-stone-500">
              ••••••••
            </p>
          </div>
        </div>
        <Button onClick={() => setOpen(true)} variant="outline" size="sm">
          Change Password
        </Button>
      </div>

      <Modal
        title="Change Password"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSave}
        okText="Update Password"
        cancelText="Cancel"
        okButtonProps={{ loading: saving }}
        destroyOnHidden
        centered
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, whitespace: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password
              prefix={<FaLock className="text-stone-400" />}
              placeholder="Enter current password"
            />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, whitespace: true, message: "Please enter a new password" },
              { min: 6, message: "Password must be at least 6 characters" },
              {
                pattern: /^\S+$/,
                message: "Password must not contain spaces",
              },
            ]}
          >
            <Input.Password
              prefix={<FaLock className="text-stone-400" />}
              placeholder="Enter new password"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, whitespace: true, message: "Please confirm the new password" },
              confirmPassword,
            ]}
          >
            <Input.Password
              prefix={<FaLock className="text-stone-400" />}
              placeholder="Re-enter new password"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminSecurity;