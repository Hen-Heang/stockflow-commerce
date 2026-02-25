import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { Modal } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import {PropagateLoader} from 'react-spinners'
export default function RetailerInvoice(props) {
  const invoiceList = useSelector((state) => state.invoice.data);
  const invoiceRef = useRef();
  const hanldePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: 'invoice',
    // onAfterPrint: () => alert("Get invoice successfully"),
  })
  const productList = useSelector((state) => state.invoice.data);
  console.log("productList", productList);
  const orderInvoiceList = useSelector((state) => state.invoice.value);

  return (
    <div>
      <div>
        <React.Fragment>
          <Modal
            show={props.invoice}
            size="xl"
            popup={true}
            onClose={props.handleClick}
          >
            <Modal.Header />
            <Modal.Body>
              {!props.loadingInvoice ?
              <div>
                <div ref={props.invoiceRef} className='px-2'>
                <div className="flex  bg-white">
                  <div className="w-2/3 flex flex-wrap text-black">
                    <div className="w-16 h-16 rounded-lg bg-warning-50">
                      <img
                        src={orderInvoiceList.storeImage} className='w-full h-full rounded-lg'
                        alt=""
                      />
                    </div>
                    <div className="w-30 text-black font-medium ml-2 mt-1">
                      <p className="text-lg font-semibold">{orderInvoiceList.storeName}</p>
                      <p className="text-xs element">{orderInvoiceList.storeAddress}</p>
                    </div>
                  </div>
                  <div className="w-1/3 justify-between font-medium text-xs">
                    <h1 className="text-retailerPrimary text-2xl">INVOICE</h1>
                    <p>Invoice Number:
                      #{orderInvoiceList.id}
                    </p>
                    <p>
                      Invoice Date:
                      {new Date(orderInvoiceList.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
                <div className="w-full h-1 bg-retailerPrimary mt-2"></div>
                <div className="flex bg-white mt-2">
                  <div className="w-2/3 text-xs  text-black">
                    <p className="text-xs text-retailerPrimary">Invoice To:</p>
                    <p className="text-sm font-semibold ">
                      {orderInvoiceList.name}
                    </p>
                    <p className="text-xs">Phone: {orderInvoiceList.retailerPhone}</p>
                    <p>Email: {orderInvoiceList.retailerEmail}</p>
                  </div>
                  <div className="w-1/3 justify-between text-xs">
                    <h1 className="text-retailerPrimary text-xs">Invoice From:</h1>
                    <p className="text-sm font-semibold">{orderInvoiceList.storeName}</p>
                    <p>Phone: {orderInvoiceList.storePrimaryPhone}</p>
                    <p className='line-clamp-1 overflow-hidden'>Email:{orderInvoiceList.storeEmail}</p>
                  </div>
                </div>
                <div class="relative  mt-2">
                  <table class="w-full text-sm text-left">
                    <thead class="text-xs text-white bg-retailerPrimary uppercase ">
                      <tr>
                        <th scope="col" class="px-2 py-3  text-white">
                          No
                        </th>
                        <th scope="col" class="px-6 py-3 text-white ">
                          Product
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Qty
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productList.map((item, index) => (
                        <tr key={item.id} class=" border-b text-black ">
                          <td
                            scope="row"
                            class="px-3 py-4 text-black whitespace-nowrap dark:text-blue-100"
                          >
                            {index + 1}
                          </td>
                          <td class="px-6 py-4">{item.productName}</td>
                          <td class="px-6 py-4 ">
                            $ {item.unitPrice == null
                              ? <span>0.00</span>
                              : (item.unitPrice).toFixed(2)
                            }
                          </td>
                          <td class="px-6 py-4">
                            {item.qty == null
                              ? <span>0</span>
                              : item.qty
                            }
                          </td>
                          <td class="px-6 py-4">
                            $ {item.subTotal == null
                              ? <span>0.00</span>
                              : (item.subTotal).toFixed(2)
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-4 px-4">
                  <div className="w-1/2 text-newGray text-sm">
                    item({productList.length})
                  </div>
                  <div className='w-1/2 flex te text-end justify-end text-sm text-black'>
                    ${orderInvoiceList.total == null
                      ? <span>0.00</span>
                      : (orderInvoiceList.total).toFixed(2)
                    }
                  </div>
                </div>
                <div className="flex justify-end mt-2 px-4">
                  <div className="w-1/2 text-sm text-newGray">
                    shipping
                  </div>
                  <div className='w-1/2 flex text-end justify-end text-xs'>$1.00</div>
                </div>
                <hr className='border border-dashed text-black' />
                <div className="flex justify-end mt-4">
                  <div className="w-1/2 text-black font-semibold">
                    Total price
                  </div>
                  <div className='w-1/2 flex text-end justify-end font-semibold text-retailerPrimary'>
                    ${orderInvoiceList.total == null
                      ? <span>0.00</span>
                      : (orderInvoiceList.total + 1).toFixed(2)
                    }
                  </div>
                </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={props.hanldePrint}
                    className="text-center text-white py-1 w-24 rounded-sm bg-newGreen items-center text-xs "
                  >
                    Export invoice
                  </button>
                </div>
              </div>
              :  
              <div className='relative' >
                <div className="flex  bg-white -mt-5]">
                  <div className="w-2/3 flex flex-wrap text-black">
                    <div className="w-16 h-16 rounded-lg bg-warning-50 ">
                      <div
                        className='w-full h-full bg-slate-300'>
                      </div>
                    </div>
                    <div className="w-30 text-black font-medium ml-2 mt-1">
                      <p className="text-sm font-semibold w-14 h-2 bg-slate-300 rounded-lg"></p>
                      <p className="text-xs element w-24 h-2 bg-slate-300 mt-1 rounded-lg"></p>
                      <p className="text-xs"></p>
                    </div>
                  </div>
                  <div className="w-1/3 justify-between font-medium text-xs">
                    <h1 className="text-retailerPrimary text-2xl">INVOICE</h1>
                    <p>Invoice Number:
                    </p>
                    <p>
                      Invoice Date:  
                    </p>
                  </div>
                </div>
                <div className="w-full h-1 bg-retailerPrimary mt-2"></div>
                <div className="flex bg-white mt-2">
                  <div className="w-2/3 text-xs  text-black">
                    <p className="text-xs text-retailerPrimary">Invoice To:</p>
                    <p className="text-sm text-semibold">
                      
                    </p>
                    <p className="text-xs">Phone: </p>
                    <p>Email: </p>
                  </div>
                  <div className="w-1/3 justify-between text-xs">
                    <h1 className="text-retailerPrimary text-xs">Invoice From:</h1>
                    <p className="text-sm"></p>
                    <p>Phone: </p>
                    <p className='line-clamp-1 overflow-hidden'>Email:</p>
                  </div>
                </div>
                <div class="relative overflow-x-auto h-[400px] mt-2">
                  <table class="w-full text-sm text-left">
                    <thead class="text-xs text-white bg-retailerPrimary uppercase ">
                      <tr>
                        <th scope="col" class="px-2 py-3  text-white">
                          No
                        </th>
                        <th scope="col" class="px-6 py-3 text-white ">
                          Product
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Qty
                        </th>
                        <th scope="col" class="px-6 py-3">
                          Total
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className='w-full mx-auto top-64 absolute text-center '>
              <PropagateLoader color="#F15B22" />
            </div>
              </div>           
}
            </Modal.Body>
          </Modal>
        </React.Fragment>
      </div>
    </div>
  )
}

