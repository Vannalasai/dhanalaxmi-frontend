import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, PlusCircle, UploadCloud, Loader2 } from "lucide-react";

// Variant type definition
interface VariantState {
  weight: string;
  price: string;
  originalPrice: string;
  quantity: string;
}

// Get Cloudinary details from .env file
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const AddProduct: React.FC = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState("4.5");
  const [description, setDescription] = useState("");
  const [benefits, setBenefits] = useState("");
  const [usage, setUsage] = useState("");
  const [variants, setVariants] = useState<VariantState[]>([
    { weight: "", price: "", originalPrice: "", quantity: "" },
  ]);

  // State for image uploading process
  const [isUploading, setIsUploading] = useState(false);

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVariantChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const values = [...variants];
    values[index][event.target.name as keyof VariantState] = event.target.value;
    setVariants(values);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { weight: "", price: "", originalPrice: "", quantity: "" },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    if (variants.length <= 1) return;
    const values = [...variants];
    values.splice(index, 1);
    setVariants(values);
  };

  // Handles the image file selection and upload to Cloudinary
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        setImage(data.secure_url);
        toast({ title: "Image uploaded successfully!" });
      } else {
        throw new Error("Image upload failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Image upload failed. Please try again.");
      toast({ title: "Image Upload Failed", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError("Please upload an image for the product.");
      return;
    }
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Admin token not found. Please log in.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          image,
          category,
          description,
          usage,
          rating: parseFloat(rating),
          benefits: benefits.split(",").map((s) => s.trim()),
          variants: variants.map((v) => ({
            weight: v.weight,
            price: parseFloat(v.price),
            originalPrice: v.originalPrice
              ? parseFloat(v.originalPrice)
              : undefined,
            quantity: parseInt(v.quantity, 10),
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: "Product added successfully!" });
        navigate("/admin/dashboard");
      } else {
        setError(data.message || "Failed to add product");
      }
    } catch (err) {
      setError("A server error occurred.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      {error && (
        <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Image Uploader */}
        <div>
          <Label htmlFor="image-upload">Product Image *</Label>
          <div className="mt-2 flex items-center gap-4">
            <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              ) : image ? (
                <img
                  src={image}
                  alt="Product Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UploadCloud className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="image-upload"
                className="cursor-pointer bg-white text-primary border border-primary hover:bg-primary/10 font-semibold py-2 px-4 rounded-md"
              >
                Choose Image
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {image && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-red-500"
                  onClick={() => setImage("")}
                >
                  Remove Image
                </Button>
              )}
              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="rating">Rating (0-5) *</Label>
          <Input
            id="rating"
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            rows={4}
            required
          />
        </div>
        <div>
          <Label htmlFor="benefits">Benefits (comma-separated) *</Label>
          <Input
            id="benefits"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="usage">Usage *</Label>
          <Input
            id="usage"
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
            required
          />
        </div>

        {/* Variants Section */}
        <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
          <Label className="text-lg font-semibold">Product Variants</Label>
          {variants.map((variant, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-3 p-2 border-b last:border-b-0"
            >
              <div className="col-span-3">
                <Label>Weight (e.g., 100g)</Label>
                <Input
                  name="weight"
                  value={variant.weight}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
              </div>
              <div className="col-span-3">
                <Label>Price (₹)</Label>
                <Input
                  name="price"
                  type="number"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
              </div>
              <div className="col-span-3">
                <Label>Original Price (₹)</Label>
                <Input
                  name="originalPrice"
                  type="number"
                  value={variant.originalPrice}
                  onChange={(e) => handleVariantChange(index, e)}
                />
              </div>
              <div className="col-span-2">
                <Label>Quantity</Label>
                <Input
                  name="quantity"
                  type="number"
                  value={variant.quantity}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />
              </div>
              <div className="col-span-1 flex items-end">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveVariant(index)}
                  disabled={variants.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddVariant}
            className="mt-2"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Add Another Variant
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2.5 rounded hover:bg-primary/90 text-base"
        >
          Add Product
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
