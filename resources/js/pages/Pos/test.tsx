"use client"

import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";

type Product = {

  id:number,
  name:string,
  barcode:string,
  sell_price:number

}


type CartItem = {
  product:Product,
  quantity:number
}



type CreateProps = {

  products:Product[]

}





export default function Create({products}:CreateProps){


  
    console.log(products);
    const [barcode,setBarcode] = useState<string>("")
    const [scannerEnabled,setScannerEnabled] = useState<Boolean>(false)
    const [cart,setCart] = useState<CartItem[]>([])



    const breadcrumbs: BreadcrumbItem[] = [
      {title:"Pos",href:"/pos/create"},
      {title:"Pos",href:"/pos/create"},
    ];


    const AddToCart = (scannedBarcode:string) =>{
      console.log('the barcode',scannedBarcode);
      const existing = products.find((i)=>i.barcode === scannedBarcode)
      

      if(existing){

        console.log('Yeah')

      }

    }

 



    const handleScan = (scannedBarcode:string) => {
      setBarcode(scannedBarcode);
      //router.post('/pos/scan-broadcast',{barcode:scannedBarcode});
      AddToCart(scannedBarcode);
    }

    



    return(

      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title = {'Pos'}/>
        <div className="p-6">
          <h1 className="p-6">Create Sale</h1>
          <div className="flex space-x-2 p-6 mb-4">
            <input 
              value={barcode}
              onChange={(e)=>{setBarcode(e.target.value)}}
              onKeyDown={(e)=>{e.key == "Enter" && handleScan(barcode)}}
              placeholder="Enter product barcode"
              className="border rounded p-2"/>


            <button onClick={()=>handleScan(barcode)}
              className="bg-blue-600 px-4 rounded"
              >Add</button>
            <button onClick={()=> setScannerEnabled(!scannerEnabled)}
            className="bg-green-600 px-4 rounded">{scannerEnabled?"Stop Scanner":"scan"}</button>

          </div>

          {scannerEnabled && (
              <div className="width-full h-64">
                <BarcodeScannerComponent 
                  height={400}
                  width={300}
                  onUpdate={(err,result)=>{
                  if(result){
                    setBarcode(result.getText);
                    handleScan(barcode)
                  }
                }}/>
              </div>

            )}

            <table className="w-full p-6 border">

              <thead>
                <tr>
                  <th className="p-2">id</th>
                  <th className="p-2">Product</th>
                  <th className="p-2">Barcode</th>
                  <th className="p-2">sell price</th>
                </tr>

              </thead>
              <tbody>
                <tr>
                  <td className="p-2">test</td>
                </tr>

              </tbody>



            </table>

          </div>
      </AppLayout>
    )

}