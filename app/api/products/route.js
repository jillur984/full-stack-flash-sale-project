import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";
import connectDB from "@/app/config/database";
import { Product } from "@/app/models/products.model";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const price = parseFloat(formData.get("price"));
    const stock = parseInt(formData.get("stock"));
    const isFlashSale = formData.get("isFlashSale") === "true";
    const flashSalePrice = formData.get("flashSalePrice");
    const flashSaleStart = formData.get("flashSaleStart");
    const flashSaleEnd = formData.get("flashSaleEnd");

    const file = formData.get("file");
    if (!file) return new Response("Image file required", { status: 400 });

    // Convert image to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Prepare cross-platform temp file path
    const tempDir = path.join(process.cwd(), "tmp");
    await fs.mkdir(tempDir, { recursive: true });

    const tempFilePath = path.join(tempDir, file.name);
    await fs.writeFile(tempFilePath, buffer);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempFilePath);
    await fs.unlink(tempFilePath); // Clean up temp file

    const imageUrl = result.secure_url;

    // Connect to DB
    await connectDB();

    const productData = {
      title,
      description,
      price,
      stock,
      image: imageUrl,
      isFlashSale,
      flashSalePrice: isFlashSale ? parseFloat(flashSalePrice) : undefined,
      flashSaleStart: isFlashSale ? flashSaleStart : undefined,
      flashSaleEnd: isFlashSale ? flashSaleEnd : undefined,
    };

    const newProduct = await Product.create(productData);

    return Response.json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return new Response("Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB(); // Ensure DB is connected

    const products = await Product.find().sort({ createdAt: -1 }); // newest first
    return Response.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response("Server Error", { status: 500 });
  }
}
