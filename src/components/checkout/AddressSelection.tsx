import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Address } from "@/lib/addressApi";
import { Loader2 } from "lucide-react";

interface AddressSelectionProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
  onAddNewAddress: () => void;
  onProceed: () => void;
  isProcessing?: boolean;
  onEditAddress: (address: Address) => void; // << 1. ఈ కొత్త ప్రాప్‌ను యాడ్ చేయండి
}

export const AddressSelection = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
  onProceed,
  isProcessing,
  onEditAddress, // << 2. ప్రాప్‌ను ఇక్కడ స్వీకరించండి
}: AddressSelectionProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center mb-4">
        <h2 className="flex items-center text-lg font-bold text-gray-800">
          <span className="bg-gray-300 text-gray-700 rounded-full flex items-center justify-center w-6 h-6 text-sm">
            2
          </span>
          <span className="ml-4">DELIVERY ADDRESS</span>
        </h2>
      </div>

      <RadioGroup
        value={selectedAddressId ?? ""}
        onValueChange={onSelectAddress}
      >
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 rounded-lg border-2 ${
                selectedAddressId === address.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start">
                <RadioGroupItem
                  value={address.id}
                  id={address.id}
                  className="mt-1"
                />
                <Label
                  htmlFor={address.id}
                  className="flex-1 ml-4 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-bold">
                      {address.name}
                      <span className="ml-3 text-xs font-normal bg-gray-200 text-gray-600 px-2 py-0.5 rounded-md">
                        {address.type}
                      </span>
                      <span className="ml-4 font-normal">{address.phone}</span>
                    </p>
                    {/* 3. బటన్‌కు onClick ఫంక్షన్ యాడ్ చేయండి */}
                    <Button
                      variant="link"
                      className="h-auto p-0 text-blue-600"
                      onClick={() => onEditAddress(address)}
                    >
                      EDIT
                    </Button>
                  </div>
                  <p className="text-gray-600 mt-1">
                    {`${address.street}, ${address.city}, ${address.state} - `}
                    <span className="font-semibold">{address.zip}</span>
                  </p>
                  {selectedAddressId === address.id && (
                    <Button
                      className="mt-4 bg-orange-500 hover:bg-orange-600 flex items-center"
                      onClick={onProceed}
                      disabled={isProcessing}
                    >
                      {isProcessing && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isProcessing
                        ? "Processing..."
                        : "DELIVER HERE & PAYMENT PROCEED"}
                    </Button>
                  )}
                </Label>
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>

      <Button
        variant="link"
        className="p-0 mt-6 text-blue-600 font-bold"
        onClick={onAddNewAddress}
      >
        + Add a new address
      </Button>
    </div>
  );
};
