import { useState } from "react";
import { Modal } from "antd";
import Button from "../../common/Button.jsx";
import { showError } from "../../common/feedback/MessageProvider.jsx";

const EMPTY_SLOT = { start: "09:00", end: "11:00" };

const PickupSlotModal = ({
  slot,
  open,
  saving = false,
  onClose,
  onSubmit,
}) => {
  const [values, setValues] = useState(() =>
    slot ? { start: slot.start, end: slot.end } : { ...EMPTY_SLOT }
  );

  const setValue = (key, value) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (!values.start || !values.end) {
      showError("Please select both start and end time.");
      return;
    }

    if (values.end <= values.start) {
      showError("End time must be later than start time.");
      return;
    }

    onSubmit(values);
  };

  const fieldClass =
    "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-200";

  return (
    <Modal
      open={open}
      title={slot ? "Edit Pickup Slot" : "Add Pickup Slot"}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={slot ? "Save Slot" : "Add Slot"}
      cancelText="Cancel"
      confirmLoading={saving}
      centered
      destroyOnHidden
      footer={[
        <Button key="cancel" variant="outline" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" onClick={handleSubmit} loading={saving}>
          {slot ? "Save Slot" : "Add Slot"}
        </Button>,
      ]}
    >
      <div className="grid grid-cols-1 gap-4 py-2 sm:grid-cols-2">
        <div>
          <label
            htmlFor="slot-start"
            className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400"
          >
            Start Time
          </label>
          <input
            id="slot-start"
            type="time"
            value={values.start}
            onChange={(event) => setValue("start", event.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="slot-end"
            className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400"
          >
            End Time
          </label>
          <input
            id="slot-end"
            type="time"
            value={values.end}
            onChange={(event) => setValue("end", event.target.value)}
            className={fieldClass}
          />
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400 sm:col-span-2">
          End time must be later than start time.
        </p>
      </div>
    </Modal>
  );
};

export default PickupSlotModal;
