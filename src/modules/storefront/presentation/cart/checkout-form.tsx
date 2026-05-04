import type { CheckoutFormState, StoreCopy } from "./cart-types";

type CheckoutFormProps = {
  form: CheckoutFormState;
  copy: StoreCopy;
  minDeliveryDate: string;
  onFieldChange: (field: keyof CheckoutFormState, value: string) => void;
};

const fieldClass =
  "ml-2 w-full rounded-xl border-2 border-[#3C2317]/20 p-2 text-sm font-bold text-[#3C2317] focus:border-[#8B5CF6] focus:outline-none";

export function CheckoutForm({ form, copy, minDeliveryDate, onFieldChange }: CheckoutFormProps) {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#3C2317]/10 bg-white p-4">
        <div className="absolute left-0 top-0 h-full w-2 bg-[#FF9B71]" />
        <label className="ml-2 mb-2 block text-sm font-black uppercase text-[#3C2317]">{copy.cartNameLabel}</label>
        <input
          type="text"
          value={form.customerName}
          onChange={(event) => onFieldChange("customerName", event.target.value)}
          placeholder={copy.cartNamePlaceholder}
          className={fieldClass}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#3C2317]/10 bg-white p-4">
          <div className="absolute left-0 top-0 h-full w-2 bg-[#FFDC39]" />
          <label className="ml-2 mb-2 block text-sm font-black uppercase text-[#3C2317]">{copy.cartContactChannelLabel}</label>
          <select
            value={form.contactChannel}
            onChange={(event) => onFieldChange("contactChannel", event.target.value)}
            className={`${fieldClass} uppercase`}
          >
            <option value="cell">{copy.cartChannelCell}</option>
            <option value="email">{copy.cartChannelEmail}</option>
          </select>
        </div>

        <div className="relative overflow-hidden rounded-2xl border-2 border-[#3C2317]/10 bg-white p-4">
          <div className="absolute left-0 top-0 h-full w-2 bg-[#9BE1E8]" />
          <label className="ml-2 mb-2 block text-sm font-black uppercase text-[#3C2317]">{copy.cartContactValueLabel}</label>
          <input
            type={form.contactChannel === "email" ? "email" : "tel"}
            inputMode={form.contactChannel === "email" ? "email" : "tel"}
            value={form.contactValue}
            onChange={(event) => onFieldChange("contactValue", event.target.value)}
            placeholder={copy.cartContactValuePlaceholder}
            className={fieldClass}
            required
          />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border-2 border-[#3C2317]/10 bg-white p-4">
        <div className="absolute left-0 top-0 h-full w-2 bg-[#FF9B71]" />
        <label className="ml-2 mb-2 flex items-center text-sm font-black uppercase text-[#3C2317]">
          <i className="ph ph-map-pin mr-2 text-lg" /> {copy.cartAddressLabel}
        </label>
        <input
          type="text"
          value={form.address}
          onChange={(event) => onFieldChange("address", event.target.value)}
          placeholder={copy.cartAddressPlaceholder}
          className={fieldClass}
          required
        />
      </div>

      <div className="relative overflow-hidden rounded-2xl border-2 border-[#3C2317]/10 bg-white p-4">
        <div className="absolute left-0 top-0 h-full w-2 bg-[#9BE1E8]" />
        <label className="ml-2 mb-1 flex items-center text-sm font-black uppercase text-[#3C2317]">
          <i className="ph ph-calendar mr-2 text-lg" /> {copy.cartDateLabel}
        </label>
        <p className="ml-2 mb-3 text-[10px] font-bold uppercase text-[#3C2317]/50">{copy.cartDateSub}</p>
        <input
          type="date"
          min={minDeliveryDate}
          value={form.deliveryDate}
          onChange={(event) => onFieldChange("deliveryDate", event.target.value)}
          className={fieldClass}
          required
        />
      </div>

      <div className="relative overflow-hidden rounded-2xl border-2 border-[#3C2317]/10 bg-white p-4">
        <div className="absolute left-0 top-0 h-full w-2 bg-[#8B5CF6]" />
        <label className="ml-2 mb-2 block text-sm font-black uppercase text-[#3C2317]">{copy.cartNotesLabel}</label>
        <textarea
          value={form.notes}
          onChange={(event) => onFieldChange("notes", event.target.value)}
          placeholder={copy.cartNotesPlaceholder}
          className={`${fieldClass} min-h-24 font-medium`}
        />
      </div>
    </div>
  );
}
