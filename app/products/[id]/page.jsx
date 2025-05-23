import React, { Fragment } from "react";
import { Product } from "@/app/models/products.model";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ProductDescription = async ({ params }) => {
  const { id } = params;

  const myProduct = await Product.findOne({ _id: id });

  if (!myProduct) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="p-6 w-full max-w-md text-center">
          <CardTitle>Product not found</CardTitle>
        </Card>
      </div>
    );
  }

  return (
    <Fragment>
      <h1 className="text-center flex items-center text-2xl justify-center mt-3 mx-auto font-bold">
        Our Flash Sale Products Details{" "}
      </h1>
      <div className="flex justify-center items-center min-h-screen px-4">
        <Card className="w-full max-w-lg shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-[#0B2A6E]">
              {myProduct.title}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {myProduct.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full h-64 relative rounded-md overflow-hidden">
              <Image
                src={myProduct.image}
                alt={myProduct.title}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-gray-700">{myProduct.description}</p>
            <p className="text-xl font-bold text-green-600">
              ${myProduct.price}
            </p>
          </CardContent>
          <Button>Order Now</Button>
        </Card>
      </div>
    </Fragment>
  );
};

export default ProductDescription;
