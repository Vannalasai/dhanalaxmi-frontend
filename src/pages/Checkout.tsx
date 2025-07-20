import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";

import { AddressSelection } from "@/components/checkout/AddressSelection";
import { PriceDetails } from "@/components/checkout/PriceDetails";
import { AddressForm } from "@/components/checkout/AddressForm";
import {
  Address,
  fetchUserAddresses,
  saveUserAddress,
  updateUserAddress,
} from "@/lib/addressApi";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const getAddresses = async () => {
      setIsLoading(true);
      try {
        const userAddresses = await fetchUserAddresses();
        setAddresses(userAddresses);
        if (userAddresses.length > 0) {
          setSelectedAddressId(userAddresses[0].id);
        } else {
          setIsAddingAddress(true);
        }
      } catch (error) {
        toast({
          title: "Authentication Error",
          description: "Could not load addresses. Please log in again.",
          variant: "destructive",
        });
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    if (items.length === 0 && !isLoading) {
      toast({ title: "Your cart is empty!", variant: "destructive" });
      navigate("/cart");
      return;
    }

    getAddresses();
  }, [items.length, navigate, toast]);

  const handleSaveOrUpdateAddress = async (
    addressData: Omit<Address, "id">
  ) => {
    if (editingAddress) {
      try {
        const updatedAddress = await updateUserAddress(
          editingAddress.id,
          addressData
        );
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === editingAddress.id ? updatedAddress : addr
          )
        );
        setEditingAddress(null);
        toast({ title: "Address updated successfully!" });
      } catch (error) {
        toast({ title: "Failed to update address", variant: "destructive" });
      }
    } else {
      try {
        const savedAddress = await saveUserAddress(addressData);
        setAddresses((prev) => [...prev, savedAddress]);
        setSelectedAddressId(savedAddress.id);
        setIsAddingAddress(false);
        toast({ title: "Address saved successfully!" });
      } catch (error) {
        toast({ title: "Failed to save address", variant: "destructive" });
      }
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
  };

  const handleCancelForm = () => {
    setEditingAddress(null);
    setIsAddingAddress(false);
  };

  const handleProceedToPayment = async () => {
    if (!selectedAddressId) {
      toast({
        title: "Please select a delivery address.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessingPayment(true);

    try {
      const token = localStorage.getItem("token");
      const shippingFee = 0; // << 'platformFee' ను 'shippingFee' గా మార్చబడింది (మీరు కావాలంటే విలువను మార్చవచ్చు)
      const finalAmount = totalPrice + shippingFee;

      // 1. బ్యాకెండ్ నుండి Razorpay ఆర్డర్‌ను సృష్టించండి
      const orderRes = await fetch(
        "https://dhanalaxmi-backend.onrender.com/api/orders/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: finalAmount }),
        }
      );

      if (!orderRes.ok) throw new Error("Failed to create Razorpay order.");
      const { data: orderData } = await orderRes.json();

      // 2. Razorpay చెకౌట్‌ను తెరవండి
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "DhanaLaxmi Foods",
        description: "Payment for your order",
        order_id: orderData.id,
        handler: async (response: any) => {
          // 3. పేమెంట్‌ను బ్యాకెండ్‌లో వెరిఫై చేయండి
          const verificationRes = await fetch(
            "https://dhanalaxmi-backend.onrender.com/api/orders/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderItems: items,
                shippingAddress: addresses.find(
                  (a) => a.id === selectedAddressId
                ),
                totalAmount: finalAmount,
              }),
            }
          );

          const verificationData = await verificationRes.json();
          if (verificationRes.ok) {
            toast({
              title: "Payment Successful!",
              description: verificationData.message,
            });
            clearCart();
            navigate("/order-history");
          } else {
            throw new Error(
              verificationData.message || "Payment verification failed."
            );
          }
        },
        prefill: {
          name: localStorage.getItem("userName") || "",
          email: localStorage.getItem("userEmail") || "",
          contact: localStorage.getItem("userMobile") || "",
        },
        theme: {
          color: "#6A994E",
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
            toast({ title: "Payment Cancelled", variant: "destructive" });
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Payment failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
      setIsProcessingPayment(false);
    }
  };

  // --- 1. LoginStep కాంపోనెంట్‌ను ఇక్కడ డిఫైన్ చేయండి ---
  const LoginStep = () => (
    <div className="bg-white p-4 flex justify-between items-center rounded-lg shadow-sm">
      <div className="flex items-center">
        <span className="bg-blue-600 text-white rounded-full flex items-center justify-center w-6 h-6 text-sm">
          1
        </span>
        <div className="ml-4">
          <p className="font-bold text-gray-500">
            LOGIN DETAILS{" "}
            <CheckCircle className="inline w-4 h-4 text-blue-600" />
          </p>
          <p className="font-semibold">
            {localStorage.getItem("userName")}{" "}
            <span className="font-normal">
              {localStorage.getItem("userMobile")}
            </span>
          </p>
        </div>
      </div>
      {/* <Button
        variant="outline"
        className="text-blue-600 font-bold border-gray-300 shadow-sm"
      >
        CHANGE
      </Button> */}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Your Checkout...</p>
      </div>
    );
  }

  const shouldShowForm = isAddingAddress || !!editingAddress;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          {/* --- 2. LoginStep కాంపోనెంట్‌ను ఇక్కడ వాడండి --- */}
          <LoginStep />

          {shouldShowForm ? (
            <AddressForm
              onSave={handleSaveOrUpdateAddress}
              onCancel={handleCancelForm}
              initialData={editingAddress}
            />
          ) : (
            <AddressSelection
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onAddNewAddress={() => setIsAddingAddress(true)}
              onProceed={handleProceedToPayment}
              isProcessing={isProcessingPayment}
              onEditAddress={handleEditAddress}
            />
          )}

          {/* <div className="bg-white p-6 rounded-lg shadow-sm opacity-50">
            <h2 className="text-lg font-bold text-gray-400">
              3 &nbsp;&nbsp;&nbsp; PAYMENT OPTIONS
            </h2>
          </div> */}
        </div>
        <div className="lg:col-span-1">
          <PriceDetails
            itemCount={items.length}
            totalMrp={totalPrice}
            shippingFee={0}
            savings={0}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
