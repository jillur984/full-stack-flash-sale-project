"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Timer from "../components/Timer";
import Loading from "../components/Loading";
import Link from "next/link";

const recordsPerPage = 4;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false); // New state for show all toggle

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <Loading />;

  // Calculate pagination info
  const totalPages = Math.ceil(products.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const currentRecords = showAll
    ? products
    : products.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleToggleShowAll = () => {
    setShowAll((prev) => !prev);
    if (showAll) {
      setCurrentPage(1);
    }
  };

  return (
    <div className="mt-10 px-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 ">
          <h2 className="font-bold text-3xl uppercase text-[#0B2A6E]">
            Flash Sale
          </h2>
          <Timer />
        </div>
        <Button
          onClick={handleToggleShowAll}
          className="flex justify-end px-4 py-1 text-[#0B2A6E] hover:text-white border border-[#0B2A6E] bg-white transition"
        >
          {showAll ? "Show Less" : "See All"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {currentRecords.map((product) => (
          <Link key={product._id} href={`/products/${product._id}`}>
            <Card className="cursor-pointer">
              <Image
                src={product.image}
                alt={product.title}
                width={500}
                height={100}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-[#0B2A6E]">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-600 text-justify">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-base font-medium text-gray-800">
                    ${product.price}
                  </p>
                  {product.isFlashSale && (
                    <p className="text-base font-bold text-[#616161] line-through">
                      ${product.flashSalePrice}
                    </p>
                  )}
                </div>
              </CardContent>
              {product.isFlashSale && (
                <div className="flex relative gap-2">
                  <div className="mb-0 mx-auto text-white w-full p-3 bg-[#0053E2] uppercase">
                    Only {product.stock} items left
                  </div>
                  <div className="flex items-center absolute bg-amber-300 mt-2 ml-2 right-3">
                    <Timer />
                  </div>
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {/* Show pagination only if NOT showing all */}
      {!showAll && (
        <div className="flex justify-center mt-8 gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages).keys()].map((num) => (
            <button
              key={num + 1}
              onClick={() => setCurrentPage(num + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === num + 1 ? "bg-blue-600 text-white" : ""
              }`}
            >
              {num + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
