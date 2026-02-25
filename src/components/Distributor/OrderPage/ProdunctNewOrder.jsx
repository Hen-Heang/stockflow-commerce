import React from 'react'
import { Modal } from 'flowbite-react'
import { PropagateLoader } from 'react-spinners'
import { useSelector } from 'react-redux';
export default function ProdunctNewOrder(props) {
    const productList = useSelector((state) => state.product.product);
    return (
        <div>
            <React.Fragment>
                <Modal
                    show={props.isOpen}
                    size="2xl"
                    popup={true}
                    onClose={props.handlePro}
                >
                    <Modal />
                    <Modal.Header className="text-center bg-primary w-full">
                        <h1 className="text-center text-white font-semiblod absolute w-full text-xl">
                            Products
                        </h1>
                        <p
                            className="text-white float-right absolute right-2 top-2 bg-primary w-8 h-8"
                            onClick={props.handlePro}
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
                        <div class="shadow-md sm:rounded-lg mt-4 relative overflow-y-auto h-[400px]">
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
                                <tbody className="text-black w-full bg-slate-50">
                                    {!props.loadingPro ?
                                        productList.map((item, index) => (
                                            <tr key={index} class="bg-white border-b text-black dark:bg-gray-800 text-sm">
                                                <td
                                                    scope="row"
                                                    class="px-6 py-2 0 whitespace-nowrap dark:text-white"
                                                >
                                                    {index + 1}
                                                </td>
                                                <td
                                                    scope="row"
                                                    class="flex items-center px-6 py-2 whitespace-nowrap"
                                                >
                                                    {item.image && item.image !== "String" ? (
                                                        <img src={item.image} alt="upload image" class="w-10 h-10 rounded-full  p-1" />
                                                    ) : (
                                                        <img src={require("../../../assets/images/image 7.png")} class="w-10 h-10 rounded-full border-primary border p-1" alt="upload" />
                                                    )}
                                                    <div class="pl-3">
                                                        <div class="text-sm">
                                                            {item.productName}
                                                        </div>
                                                        <div class="font-normal text-xs text-newGray">
                                                            {/* {item.category.name} */}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td class="px-6 py-2">
                                                    {item.qty}
                                                </td>
                                                <td class="px-6 py-2">
                                                    {item.inStock}
                                                </td>
                                                <td class="px-6 py-2">
                                                    ${item.unitPrice == null
                                                        ? <span>0.00</span>
                                                        : (item.unitPrice).toFixed(2)
                                                    }
                                                </td>
                                                <td class="px-6 py-4">
                                                    ${item.subTotal == null
                                                        ? <span>0.00</span>
                                                        : (item.subTotal).toFixed(2)
                                                    }
                                                </td>
                                            </tr>
                                        ))
                                        : <div className='w-full mx-auto text-center absolute mt-24 '>
                                            <PropagateLoader color="#0F766E" />
                                        </div>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="w-full justify-end flex mt-8 h-8">
                            {!props.loadingPro ?
                                <div>
                                    <button onClick={props.delete} className="text-white text-md mr-2 bg-newRed rounded-md w-20 py-[4px]">
                                        Decline
                                    </button>
                                    <button onClick={props.handleAccept} className="bg-newGreen text-md text-white rounded-md w-20 py-[4px]"
                                    > Accept
                                    </button>
                                </div>
                                : null
                            }
                        </div>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
            {/* delete */}
            <React.Fragment>
                <Modal
                    show={props.isDelete}
                    size="md"
                    popup={true}
                    onClose={props.delete}
                >
                    <Modal.Header />
                    <Modal.Body>
                        <div className=" mx-auto text-center ">
                            <div className="mx-auto rounded-full w-20 h-20 justify-center">

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="mx-auto text-white fill-primary w-18 h-18 mb-4 mt-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>

                            </div>
                            <div className="w-96 mx-auto">
                                <h3 className="mb-2 text-lg  text-black">
                                    Are you sure you want to decline ?
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    If you choose confirm order will be
                                    decline{" "}
                                </p>
                                <p className="text-sm text-gray-500">
                                    and deleted from your order.{" "}
                                </p>
                                <div className="flex justify-center gap-2 w-full mt-5 mb-5 p-3 ">
                                    <button
                                        className="py-1 text-sm rounded w-32 text-white bg-primary hover:bg-[#0f7884] justify-center mr-5"
                                        onClick={props.handleDelete}
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={props.delete}
                                        class="text-semibold text-sm py-1 text-center w-32 item-center rounded border border-primary  text-primary hover:bg-primary hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        </div>
    )
}

