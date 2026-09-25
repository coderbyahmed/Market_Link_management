import { Drawer, Image, Descriptions } from "antd";
import Button from "../../common/Button.jsx";
import { formatShortDate } from "../../../utils/date.js";

const CropListingDetailsDrawer = ({ listing, open, onClose }) => {
  return (
    <Drawer
      title={
        listing ? (
          <span className="flex items-center gap-2">
            {listing.name}
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-400">
              {listing.category}
            </span>
          </span>
        ) : (
          "Crop Details"
        )
      }
      placement="right"
      open={open}
      onClose={onClose}
      width={440}
      className="max-w-full"
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      {listing && (
        <div className="space-y-5">
          <div className="flex items-center justify-center">
            <Image
              src={listing.image}
              alt={listing.name}
              width={160}
              height={160}
              className="rounded-2xl object-cover"
              fallback="/placeholder.svg"
            />
          </div>

          <section className="rounded-2xl border border-stone-200/70 p-4 dark:border-stone-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Pricing & Stock
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-stone-500 dark:text-stone-400">Price</p>
                <p className="font-semibold text-stone-900 dark:text-white">
                  Rs. {Number(listing.price).toLocaleString()} / {listing.unit}
                </p>
              </div>
              <div>
                <p className="text-stone-500 dark:text-stone-400">Available Stock</p>
                <p className="font-semibold text-stone-900 dark:text-white">
                  {listing.quantity} {listing.unit}
                </p>
              </div>
              <div>
                <p className="text-stone-500 dark:text-stone-400">Availability</p>
                <p className="font-semibold text-stone-900 dark:text-white capitalize">
                  {listing.availability.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-stone-500 dark:text-stone-400">Visibility</p>
                <p className="font-semibold text-stone-900 dark:text-white capitalize">
                  {listing.visibility}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200/70 p-4 dark:border-stone-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Market & Schedule
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Market</span>
                <span className="font-medium text-stone-900 dark:text-white">
                  {listing.market}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500 dark:text-stone-400">Operating Days</span>
                <span className="font-medium text-stone-900 dark:text-white">
                  {listing.days.join(", ")}
                </span>
              </div>
            </div>
          </section>

          <Descriptions
            column={1}
            size="small"
            labelStyle={{ color: "inherit" }}
            items={[
              {
                key: "updated",
                label: "Last Updated",
                children: formatShortDate(listing.updatedAt),
              },
            ]}
          />
        </div>
      )}
    </Drawer>
  );
};

export default CropListingDetailsDrawer;