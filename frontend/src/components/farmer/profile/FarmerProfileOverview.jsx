import { Tag } from "antd";
import { GiFarmTractor } from "react-icons/gi";
import Button from "../../common/Button.jsx";

const FarmerProfileOverview = ({ profile, imageUrl, onEdit }) => {
  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900 sm:p-8">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left md:gap-8">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={profile.name}
            className="h-24 w-24 shrink-0 rounded-2xl object-cover shadow-sm"
          />
        ) : (
          <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            <GiFarmTractor className="h-11 w-11" />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-stone-900 dark:text-white">
            {profile.name}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-brand-700">
            {profile.role}
          </p>
          <p className="mt-1 truncate text-sm text-stone-500 dark:text-stone-400">
            {profile.email}
          </p>
          <div className="mt-3">
            <Tag color="success" className="!rounded-full">
              {profile.status}
            </Tag>
          </div>
        </div>

        <Button onClick={onEdit} variant="outline" className="shrink-0">
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default FarmerProfileOverview;
