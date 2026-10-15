"use client"
import Image from "next/image";

import { mockData } from "./seed";
import { useEffect, useState } from "react";



interface Product {
  id: number,
  name: string,
  category: string,
  quantity: number,
  price: number
}
export default function Home() {

  const [data, setData] = useState<Array<Product>>([])
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [totalStoreValue, setTotalStoreValue] = useState<number>(0)
  const [totalOutOfStock, setTotalOutOfStock] = useState<number>(0)
  const [totalCategories, setTotalCategories] = useState<number>(0)
  const [selectedId, setSelectedId] = useState<Number | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({})

  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [loading, setLoading] = useState(true)
  function handleDelete() {
    const filteredData = data.filter((item) => item.id !== selectedId)
    setData(filteredData)
    setSelectedId(null)
    setOpenDeleteModal(false)
  }

  const handleOpenDeleteModal = (id: number) => {
    setSelectedId(id)
    setOpenDeleteModal(true)
  }

  const handleEditModal = (id: number) => {
    setSelectedId(id)
    setOpenEditModal(true)
  }

    const handleFieldChange = (e: any)=>{
        const {name, value} = e.target

        setFormData((prev)=>({
          ...prev,
          [name] : value
        }))
    } 

    async function  handleSubmit (e: any) {
      e.preventDefault()
      if(formData){
        try{

          const res = await fetch('/add-product',{
            method:"POST",
            body:JSON.stringify(formData)
          })

          const data = await res.json()

          console.log(data)
        }catch(e){
          console.error(e)
        }finally{
        alert("Data saved Successfully")
        setOpenEditModal(false)
      }
      } 
    }

  useEffect(() => {
    function computeInitialData() {

      const totalprod = data.length
      setTotalProducts(totalprod)

      const totalStValue = data.reduce((acc, item) => acc += item.price * item.quantity, 0)
      setTotalStoreValue(totalStValue)

      const outofStk = data.filter((item) => item.quantity === 0)
      setTotalOutOfStock(outofStk.length)

      const map = new Map()

      for (const item of data) {
        if (map.has(item.category)) {
          continue
        }
        map.set(item.category, 1)
      }

      if (data.length) {
        setTotalCategories(map.size)
      }

    }

    computeInitialData()

  }, [data])

  useEffect(() => {
    if (mockData) {
      setData(mockData)
      setLoading(false)
    }

  }, [])


  if (loading) return <div className="w-screen h-screen flex items-center justify-center">loading...</div>

  return (
    <div className="w-screen h-screen flex  flex-col p-8 gap-8 relative">
      <div className="max-w-xl w-full text-2xl p-8"> Inventory Dashboard</div>
      <div className="cards flex w-[80vw] gap-4">
        <div className=" border ">
          <div>Total Products</div>
          <div> {totalProducts}</div>
        </div>
        <div className=" border ">
          <div>Total Store Value</div>
          <div> {totalStoreValue}</div>
        </div>
        <div className=" border ">
          <div>Out of Stock</div>
          <div> {totalOutOfStock}</div>
        </div>
        <div className=" border ">
          <div>Categories</div>
          <div> {totalCategories}</div>
        </div>
      </div>
      <div className="table">

        <table className="border">
          <thead className="border">
            <td className=""> Product Name</td>
            <td className="pl-3"> Category</td>
            <td className="pl-3"> Price</td>
            <td className="pl-3"> quantity</td>
            <td className="pl-3"> Value</td>
            <td className="pl-3"> Actions</td>
          </thead>
          <tbody className="">

            {data.map((item) => {
              return <tr key={item.id} className="">
                <td className="">{item.name}</td>
                <td className="pl-3">{item.category}</td>
                <td className="pl-3">{item.price}</td>
                <td className="pl-3">{item.quantity} </td>
                <td className="pl-3">{item.quantity * item.price}</td>
                <td className="pl-3 flex gap-3">
                  <button className="text-amber-50 hover:cursor-pointer" onClick={() => handleEditModal(item.id)} >
                    Edit
                  </button>
                  <button className="text-red-500 hover:cursor-pointer" onClick={() => handleOpenDeleteModal(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>


            })}

          </tbody>
        </table>


      </div>

      {openDeleteModal &&
        <div className="absolute  border bg-[#0a0a0a] p-4 size-[300px]  top-1/3 left-1/3">
          <div className="flex  justify-between">
            < div className="font-bold">Delete Modal</div>
            <div>
              <button className="text-red-500 hover:cursor-pointer" onClick={() => setOpenDeleteModal(false)}>
                X
              </button>
            </div>
          </div>

          <div className="pt-4">are you sure you want to delete the product</div>
          <button className="bg-red-900 text-white hover:cursor-pointer p-2 rounded-2xl" onClick={() => handleDelete()}>Delete</button>
        </div>
      }

      {openEditModal &&
        <div className="absolute  border bg-[#0a0a0a] p-4 size-[300px]  top-1/3 left-1/3">
          <div className="flex  justify-between">
            < div className="font-bold">Edit Modal</div>
            <div>
              <button className="text-red-500 hover:cursor-pointer" onClick={() => setOpenEditModal(false)}>
                X
              </button>
            </div>


          </div>
          <div>
            <form onChange={handleFieldChange} onSubmit={handleSubmit}>
              <div className=" text-white">
                <span>Name</span>
                <input type="text" name="name" className="border" />
              </div>
              <div className=" text-white flex">
                  <span>Category</span>
                  <input type="text" name="category" className="border" />
              </div>
                <div className=" text-white flex">
                  <span>Quantity</span>
                  <input type="number" name="quantity" className="border" />
                </div>
                <div className=" text-white flex">
                  <span>Value</span>
                  <input type="string" name="value" className="border" />
                </div>
                <button className="bg-green-900 text-white hover:cursor-pointer p-2 rounded-2xl" type="submit">Save</button>
            </form>
          </div>
        </div>
      }
    </div>
  );
}
