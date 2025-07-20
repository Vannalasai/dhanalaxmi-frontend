import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Address } from "@/lib/addressApi";

interface AddressFormProps {
  onSave: (address: Omit<Address, "id">) => void;
  onCancel: () => void;
  initialData?: Address | null; // << 1. ఎడిటింగ్ కోసం ఈ ప్రాప్‌ను యాడ్ చేయండి
}

export const AddressForm = ({
  onSave,
  onCancel,
  initialData,
}: AddressFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    type: "HOME" as "HOME" | "WORK",
  });

  // 2. initialData ఉన్నప్పుడు ఫారంను నింపండి
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        phone: initialData.phone,
        street: initialData.street,
        city: initialData.city,
        state: initialData.state,
        zip: initialData.zip,
        type: initialData.type,
      });
    } else {
      // కొత్త అడ్రస్ కోసం localStorage నుండి డిఫాల్ట్ విలువలను లోడ్ చేయండి
      setFormData({
        name: localStorage.getItem("userName") || "",
        phone: localStorage.getItem("userMobile") || "",
        street: "",
        city: "",
        state: "",
        zip: "",
        type: "HOME",
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        {/* 3. హెడ్డింగ్‌ను డైనమిక్‌గా మార్చండి */}
        <CardTitle>
          {initialData ? "Edit Delivery Address" : "Add a New Delivery Address"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="street">Address (House No, Street, Area)</Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="zip">Pincode</Label>
              <Input
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Save Address
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
