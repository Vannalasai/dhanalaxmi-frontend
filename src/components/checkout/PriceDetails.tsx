import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck } from "lucide-react";

interface PriceDetailsProps {
  itemCount: number;
  totalMrp: number;
  shippingFee: number; // << 'platformFee' ను 'shippingFee' గా మార్చబడింది
  savings: number;
}

export const PriceDetails = ({
  itemCount,
  totalMrp,
  shippingFee, // << 'platformFee' ను 'shippingFee' గా మార్చబడింది
  savings,
}: PriceDetailsProps) => {
  const totalPayable = totalMrp + shippingFee; // << ఇక్కడ కూడా మార్చబడింది

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-gray-500 font-semibold tracking-wider">
          PRICE DETAILS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Price ({itemCount} item)</span>
          <span>₹{totalMrp.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between">
          {/* లేబుల్ మార్చబడింది */}
          <span>Shipping Fee</span>
          {shippingFee > 0 ? (
            <span className="text-gray-800">
              ₹{shippingFee.toLocaleString("en-IN")}
            </span>
          ) : (
            <span className="text-green-600">Free</span>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-lg font-bold">
          <span>Total Payable</span>
          <span>₹{totalPayable.toLocaleString("en-IN")}</span>
        </div>

        {savings > 0 && (
          <div className="text-green-600 font-bold text-center bg-green-50 p-3 rounded-lg mt-4">
            Your Total Savings on this order ₹{savings.toLocaleString("en-IN")}
          </div>
        )}
      </CardContent>
      <Separator />
      <div className="p-6 text-xs text-gray-500 flex items-start gap-3">
        <ShieldCheck className="w-8 h-8 text-gray-400 flex-shrink-0 mt-[-4px]" />
        <p>Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
      </div>
    </Card>
  );
};
