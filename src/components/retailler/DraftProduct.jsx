import React from 'react'
import { Modal } from 'flowbite-react'
import { useSelector } from 'react-redux';
export default function DraftProduct(props) {
    console.log(props.item)
    return (
        <div>
            <React.Fragment>
                <Modal
                    show={props.isOpen}
                    size="2xl"
                    popup={true}
                    onClose={props.handleOpen}
                >
                    <Modal />
                    <Modal.Header className="text-center bg-retailerPrimary w-full">
                        <h1 className="text-center text-white font-semiblod ml-72 text-xl">
                            Products
                        </h1>
                        <p
                            className="text-white float-right absolute right-2 top-2 bg-retailerPrimary w-8 h-8"
                            onClick={props.handleOpen}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6 font-bold text-white"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </p>
                    </Modal.Header>
                    <Modal.Body className="">
                        <div class="shadow-md sm:rounded-lg mt-4 relative overflow-y-auto">
                            <table>
                            <table class="w-full text-sm text-left text-newGray">
                                <thead class="text-xs text-black bg-newWhite shadow-md border-spacint">
                                    <tr>
                                        <th scope="col" class="px-6 py-3">
                                            No
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Products
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Qty
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Stock
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Unitprice
                                        </th>
                                        <th scope="col" class="px-6 py-3">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-black">
                                    {props.product.map((item, index) => (
                                        // <tr class="bg-white border-b text-black dark:bg-gray-800 text-sm">
                                        //     <td
                                        //         scope="row"
                                        //         class="px-6 py-4 0 whitespace-nowrap dark:text-white"
                                        //     >
                                        //         {index + 1}
                                        //     </td>
                                        //     <td
                                        //         scope="row"
                                        //         class="flex items-center px-6 py-4 whitespace-nowrap"
                                        //     >
                                        //         {item.image ? (
                                        //             <img src={item.image} alt="upload image" class="w-10 h-10 rounded-full p-1" />
                                        //         ) : (
                                        //             // <div className='flex flex-col'>
                                        //             <img class="w-10 h-10 rounded-full border-primary border p-1" alt="upload" />
                                        //             // <p className='text-primary ml-12'>Click to upload <span className='text-newGray font-semibold text-center '><br />or drag to drop</span></p>
                                        //             // </div>
                                        //         )}
                                        //         <div class="pl-3">
                                        //             <div class="text-sm">
                                        //                 {item.productName}
                                        //             </div>
                                        //             <div class="font-normal text-xs text-newGray">
                                        //                 {/* {item.category.name} */}
                                        //             </div>
                                        //         </div>
                                        //     </td>
                                        //     <td class="px-6 py-4">
                                        //         {item.qty}
                                        //     </td>
                                        //     <td class="px-6 py-4">
                                        //         {item.inStock}
                                        //     </td>
                                        //     <td class="px-6 py-4">
                                        //         ${item.unitPrice}
                                        //     </td>
                                        //     <td class="px-6 py-4">
                                        //         ${item.subTotal}
                                        //     </td>
                                        // </tr>
                                        <tr>
                                            <td>{item.productId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            </table>
                            <button  className="bg-retailerPrimary text-md text-white rounded-md w-24 ml-2  py-[6px]">
                                Check Out
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        </div>
    )
}
