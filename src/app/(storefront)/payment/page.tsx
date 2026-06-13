import { redirect } from "next/navigation";

/* Payment is now merged into /checkout */
export default function PaymentPage() {
  redirect("/checkout");
}
