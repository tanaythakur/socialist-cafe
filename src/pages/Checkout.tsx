import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { OrderSummary } from "@/components/OrderSummary";
import { ArrowLeft, User, Phone, MapPin, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FormData = {
  fullName: string;
  phone: string;
  specialInstructions: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, tableNumber, clearCart } = useCart();
  const [form, setForm] = useState<FormData>({
    fullName: "",
    phone: "",
    specialInstructions: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    navigate("/");
    return null;
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Please enter your full name";
    if (!form.phone.trim()) newErrors.phone = "Please enter your phone number";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(form.phone)) newErrors.phone = "Please enter a valid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    const orderId = `TSC-${String(Math.floor(Math.random() * 900) + 100)}`;
    clearCart();
    navigate("/order-confirmation", {
      state: {
        orderId,
        items,
        total,
        tableNumber,
        customerName: form.fullName,
        estimatedMinutes: 15,
      },
    });
  };

  const Field = ({
    label,
    icon: Icon,
    id,
    error,
    children,
  }: {
    label: string;
    icon: React.ElementType;
    id: string;
    error?: string;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-primary" />
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-4 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <h1 className="font-display font-semibold text-foreground text-lg">Checkout</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-6 flex flex-col gap-6">
        {/* Order Summary */}
        <OrderSummary items={items} total={total} tableNumber={tableNumber} />

        {/* Form */}
        <div className="bg-card rounded-2xl border border-border shadow-cafe p-5">
          <h2 className="font-display font-semibold text-foreground mb-5">Your Details</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="Full Name" icon={User} id="fullName" error={errors.fullName}>
              <input
                id="fullName"
                type="text"
                placeholder="e.g. Amara Nwosu"
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className={cn(
                  "w-full px-4 py-3.5 rounded-xl border bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                  errors.fullName ? "border-destructive" : "border-border"
                )}
              />
            </Field>

            <Field label="Phone Number" icon={Phone} id="phone" error={errors.phone}>
              <input
                id="phone"
                type="tel"
                placeholder="e.g. 0712 345 678"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className={cn(
                  "w-full px-4 py-3.5 rounded-xl border bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                  errors.phone ? "border-destructive" : "border-border"
                )}
              />
            </Field>

            <Field label="Table Number" icon={MapPin} id="table">
              <input
                id="table"
                type="text"
                value={tableNumber ? `Table ${tableNumber}` : "Walk-in"}
                disabled
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-muted text-muted-foreground text-base cursor-not-allowed"
              />
            </Field>

            <Field label="Special Instructions" icon={FileText} id="instructions">
              <textarea
                id="instructions"
                placeholder="Any allergies or special requests? (optional)"
                value={form.specialInstructions}
                onChange={(e) => setForm((f) => ({ ...f, specialInstructions: e.target.value }))}
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-background text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all"
                rows={3}
              />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className={cn(
                "w-full py-4 rounded-2xl font-semibold text-base transition-all shadow-pistachio",
                submitting
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]"
              )}
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Placing Order…
                </span>
              ) : (
                `Confirm Order • $${total.toFixed(2)}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
