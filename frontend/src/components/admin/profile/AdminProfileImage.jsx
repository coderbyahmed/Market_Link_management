import { Upload } from "antd";
import { FaCloudUploadAlt, FaTrashAlt } from "react-icons/fa";
import { showError } from "../../common/feedback/MessageProvider.jsx";
import Button from "../../common/Button.jsx";

const { Dragger } = Upload;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;

const AdminProfileImage = ({
  savedProfileImage,
  pendingProfileImage,
  onSelect,
  onSave,
  onRemove,
  saving,
  removing,
}) => {
  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      showError("Only JPG, PNG and WEBP images are allowed.");
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showError("Image must be smaller than 5MB.");
      return false;
    }
    return true;
  };

  const handleFile = (file) => {
    if (!validateFile(file)) return Upload.LIST_IGNORE;

    const reader = new FileReader();
    reader.onload = () => onSelect(reader.result, file);
    reader.readAsDataURL(file);
    return false;
  };

  const imageBusy = saving || removing;

  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <h2 className="font-display text-lg font-semibold tracking-tight text-stone-900 dark:text-white">
        Profile Picture
      </h2>
      <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">
        Upload a square image for your admin profile.
      </p>

      <div className="mt-5">
        <Dragger
          accept="image/jpeg,image/png,image/webp"
          multiple={false}
          showUploadList={false}
          beforeUpload={handleFile}
          className="rounded-2xl"
        >
          <FaCloudUploadAlt className="mx-auto h-10 w-10 text-brand-500" />
          <p className="mt-3 font-medium text-stone-700 dark:text-stone-300">
            Click or drag image here
          </p>
          <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
            JPG / JPEG / PNG / WEBP
          </p>
        </Dragger>
      </div>

      {pendingProfileImage && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
            Selected Image
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4 rounded-xl border border-stone-200 p-3 dark:border-stone-800">
            <img
              src={pendingProfileImage}
              alt="Pending profile picture preview"
              className="h-20 w-20 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Image selected successfully.
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-500">
                It will become your profile picture once saved.
              </p>
            </div>
            <div className="ml-auto flex shrink-0 flex-wrap items-center gap-2">
              <Button
                onClick={onRemove}
                variant="outline"
                size="sm"
                className="!border-red-300 !text-red-600 hover:!bg-red-50"
                disabled={imageBusy}
              >
                <FaTrashAlt className="h-3.5 w-3.5" /> Remove
              </Button>
              <Button
                onClick={onSave}
                size="sm"
                loading={saving}
                disabled={imageBusy}
              >
                {saving ? "Saving..." : "Save Profile Picture"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!pendingProfileImage && savedProfileImage && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
            Current Profile Picture
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4 rounded-xl border border-stone-200 p-3 dark:border-stone-800">
            <img
              src={savedProfileImage}
              alt="Saved profile picture"
              className="h-20 w-20 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Saved profile picture
              </p>
              <p className="text-xs text-stone-400 dark:text-stone-500">
                Select a new image above to replace it.
              </p>
            </div>
            <Button
              onClick={onRemove}
              variant="outline"
              size="sm"
              className="ml-auto shrink-0 !border-red-300 !text-red-600 hover:!bg-red-50"
              disabled={removing}
            >
              <FaTrashAlt className="h-3.5 w-3.5" /> Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfileImage;