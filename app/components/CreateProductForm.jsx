"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function CreateProductForm() {
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    isFlashSale: false,
    flashSalePrice: "",
    flashSaleStart: "",
    flashSaleEnd: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    const val =
      type === "checkbox"
        ? checked
        : type === "number"
        ? name === "price" || name === "flashSalePrice"
          ? parseFloat(value)
          : parseInt(value)
        : value;

    setProduct((prev) => {
      const updated = {
        ...prev,
        [name]: val,
      };

      if (name === "isFlashSale" && !checked) {
        updated.flashSalePrice = "";
        updated.flashSaleStart = "";
        updated.flashSaleEnd = "";
      }

      return updated;
    });
  };

  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Append all product fields to formData
      formData.append("title", product.title);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("isFlashSale", product.isFlashSale);

      if (product.isFlashSale) {
        formData.append("flashSalePrice", product.flashSalePrice);
        formData.append("flashSaleStart", product.flashSaleStart);
        formData.append("flashSaleEnd", product.flashSaleEnd);
      }

      formData.append("file", file); // Append image file

      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      const data = await response.json();
      console.log("Product created:", data);
      alert("Product created successfully!");

      router.push("/products");
    } catch (error) {
      console.error(error);
      alert("Error creating product");
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-10 p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-center text-lime-800 mb-4">
        Flash Sale Product Entry
      </h2>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={product.title}
              onChange={handleFormChange}
              required
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={product.description}
              onChange={handleFormChange}
              placeholder="Product description"
              required
            />
          </div>

          <div>
            <Label>Product Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded mt-2"
              />
            )}
          </div>

          <div>
            <Label>Price</Label>
            <Input
              type="number"
              name="price"
              value={product.price}
              onChange={handleFormChange}
              required
            />
          </div>

          <div>
            <Label>Stock</Label>
            <Input
              type="number"
              name="stock"
              value={product.stock}
              onChange={handleFormChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>
              <input
                type="checkbox"
                name="isFlashSale"
                checked={product.isFlashSale}
                onChange={handleFormChange}
                className="mr-2"
              />
              Enable Flash Sale
            </Label>
          </div>

          {product.isFlashSale && (
            <div className="space-y-2">
              <div>
                <Label>Flash Sale Price</Label>
                <Input
                  type="number"
                  name="flashSalePrice"
                  value={product.flashSalePrice}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label>Flash Sale Start</Label>
                <Input
                  type="datetime-local"
                  name="flashSaleStart"
                  value={product.flashSaleStart}
                  onChange={handleFormChange}
                />
              </div>
              <div>
                <Label>Flash Sale End</Label>
                <Input
                  type="datetime-local"
                  name="flashSaleEnd"
                  value={product.flashSaleEnd}
                  onChange={handleFormChange}
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full mt-4">
            Create Product
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
