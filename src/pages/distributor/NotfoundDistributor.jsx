import React, { useEffect } from 'react'

export default function NotfoundDistributor() {
  useEffect(() => {
    document.title = "StockFlow Commerce | Page-Not-Found";
  }, []);
  return (
    <div className='bg-white '>
    <div className=''>
    <img
          src={require("../../assets/images/distributor/error404dis.jpg")}
          alt=""
          className="mx-auto bg-white"
        />
    </div>
</div>
  )
}

