import { FormEvent } from "react";
import { useForm } from "@inertiajs/react";
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface ProductForm {
  sku: string;
  name: string;
  cost_price: number | string;
  sell_price: number | string;
}

export default function Create() {

  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Inventory", href: "/products/create" },
    { title: "Create Product", href: "/products/create" }
  ];


  const { data, setData, post, processing, errors } = useForm<ProductForm>({
    sku: "",
    name: "",
    cost_price: "",
    sell_price: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post("/products");
  };

  return (


            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Manage Reports" />
                <div className="flex justify-center items-center w-full h-full py-10">
                    {/* Create Product  */}

                      <div className="p-6 max-w-lg">
                        <h1 className="text-xl font-bold mb-4">Create Product</h1>

                        <form onSubmit={handleSubmit} className="space-y-4">
                        {/* SKU */}
                        <div>
                        <input
                        className="input"
                        placeholder="SKU"
                        value={data.sku}
                        onChange={(e) => setData("sku", e.target.value)}
                        />
                        {errors.sku && <p className="text-red-500 text-sm">{errors.sku}</p>}
                        </div>

                        {/* Name */}
                        <div>
                        <input
                        className="input"
                        placeholder="Name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        {/* Cost Price */}
                        <div>
                        <input
                        className="input"
                        type="number"
                        placeholder="Cost Price"
                        value={data.cost_price}
                        onChange={(e) => setData("cost_price", e.target.value)}
                        />
                        {errors.cost_price && (
                        <p className="text-red-500 text-sm">{errors.cost_price}</p>
                        )}
                        </div>

                        {/* Sell Price */}
                        <div>
                        <input
                        className="input"
                        type="number"
                        placeholder="Sell Price"
                        value={data.sell_price}
                        onChange={(e) => setData("sell_price", e.target.value)}
                        />
                        {errors.sell_price && (
                        <p className="text-red-500 text-sm">{errors.sell_price}</p>
                        )}
                        </div>

                        {/* Submit */}
                        <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={processing}
                        >
                        {processing ? "Saving..." : "Save"}
                        </button>
                        </form>
                      </div>



                    {/* End Create Product */}
                </div>
            </AppLayout>



 
  );
}
