import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { EffectCoverflow, Autoplay } from "swiper";
import { Link } from "react-router-dom";
export default function Landing() {
  return (
    <div className="">
      <header>
        <nav class="bg-primary">
          <div class="flex flex-wrap justify-between mx-auto container">
            <a href="" class="flex items-center">
              <img
                src={require("../../assets/images/Landing/logo.png")}
                class="lg:h-24 h-14 mr-1"
                alt="warehouse logo"
              />
              <span class="text-md lg:text-2xl font-semibold  dark:text-white text-white">
                Warehouse <br />
                Master
              </span>
            </a>
            <div class="flex items-center">
              <Link
                to="/sign-in"
                class="lg:mr-6 sm:mr-4 mr-2 text-semibold text-sm  dark:text-white text-center lg:w-24 w-16 h-6 item-center lg:h-10 lg:leading-9 lg:rounded-xl rounded-lg border-2 border-white lg:text-xl text-white b "
              >
                Log In
              </Link>
              <Link
                to="/sign-up"
                class="text-semibold text-sm  dark:text-white text-center lg:w-24 w-16 h-6 item-center lg:h-10 lg:leading-9 lg:rounded-xl border-2 border-white lg:text-xl text-white rounded-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <section className="mb-20">
        <div className="flex sm:flex-row flex-col items-center mx-auto container w-full mt-3">
          <div className="lg:w-1/3 w-full  ">
            <img
              src={require("../../assets/images/Landing/Grocery.png")}
              alt="grocery"
              className=""
            />
          </div>
          <div className="lg:w-2/3 w-full bg-white">
            <h1 class="lg:mb-4 text-center sm:text-left text-2xl font-semibold  dark:text-white lg:text-4xl lg:leading-16 text-primary lg:ml-20 lg:mt-0 sm:text-2xl sm:mt-0">
              <span class=" text-newGray">Connecting quality</span> Product{" "}
              <br />
              <span className="text-newGray">with trusted</span> Distributors
            </h1>
            {/* <h1 class="mb-4 text-center lg:hidden block lg:text-left text-2xl font-semibold sm:text-xl sm:mt-20 dark:text-white lg:text-4xl lg:leading-16 text-primary sm:ml-6 "><span class=" text-newGray">Connecting quality</span> Product <span className='text-newGray'>with trusted <br /></span> Distributors</h1> */}
            {/* <h1 class="mb-4 text-center lg:hidden block lg:text-left text-2xl font-semibold sm:text-xl sm:mt-20 dark:text-white lg:text-4xl lg:leading-16 text-primary sm:ml-6 "><span class=" text-newGray">Connecting quality</span> Product <br /> <span className='text-newGray'>with trusted</span> Distributors</h1> */}
            <p class="lg:block sm:block hidden lg:text-lg sm:text-sm font-normal text-gray-500 dark:text-gray-400 md lg:ml-20 lg:mt-10">
              StockFlow Commerce is a platform that connects Products with
              Distributors and Retailers in their target market and helps
              Distributors and Retailers find new and innovative products.
              <span className="lg:inline-block hidden">
                {" "}
                StockFlow Commerce will provide you the most unforgettable
                experience.
              </span>
            </p>
            <p class="sm:hidden font-normal text-gray-500 lg:text-xl dark:text-gray-400 md text-sm ml-4 ">
              StockFlow Commerce is a platform that connects Products with
              Distributors
              <br /> and Retailers in their target market and helps Distributors
              and Retailers find <br /> new and innovative products.
            </p>
          </div>
        </div>
        <div className="lg:mt-0 mt-12 sm:-mt-4 justify-between items-center mx-auto container flex flex-wrap">
          <div className="w-full text-center lg:mt-4 mt-4 lg:text-4xl text-2xl font-semibold text-newGray lg:mb-5 mb-3">
            Our Best Features{" "}
          </div>
          <div class="w-full flex flex-wrap ">
            <div className="lg:w-1/3 w-full flex flex-wrap">
              <div className="lg:w-1/5 w-1/6">
                <img
                  src={require("../../assets/images/Landing/tracking 1.png")}
                  alt=""
                  className="lg:h-10 lg:ml-6 h-8 mt-2 sm:ml-5 md:ml-12"
                />
              </div>
              <div className="lg:w-4/5 w-5/6">
                <h1 className="lg:text-2xl text-lg text-primary font-semibold mt-5">
                  Track Order
                </h1>
                <p className="text-newGray lg:text-lg text-sm">
                  Able to track order no need to wait and guess when order will
                  arrive
                </p>
              </div>
            </div>
            <div className="lg:w-1/3 w-full flex flex-wrap">
              <div className="lg:w-1/5 w-1/6 ">
                <img
                  src={require("../../assets/images/Landing/database 2.png")}
                  alt=""
                  className="lg:h-10 lg:ml-6 mt-2 h-8 sm:ml-5  md:ml-12"
                />
              </div>
              <div className="lg:w-4/5 w-5/6">
                <h1 className="lg:text-2xl text-lg text-primary font-semibold mt-5">
                  Export Report
                </h1>
                <p className="text-newGray lg:text-lg text-sm">
                  Easily export your order report to know how much you have
                  spent
                </p>
              </div>
            </div>
            <div className="lg:w-1/3 w-full flex flex-wrap">
              <div className="lg:w-1/5 w-1/6 ">
                <img
                  src={require("../../assets/images/Landing/bell 1.png")}
                  alt=""
                  className="lg:h-10 lg:ml-6 mt-2 h-8 sm:ml-5  md:ml-12"
                />
              </div>
              <div className="lg:w-4/5 w-5/6">
                <h1 className="lg:text-2xl text-lg text-primary font-semibold mt-5">
                  Available product alert
                </h1>
                <p className="text-newGray lg:text-lg text-sm">
                  Get timely alert when product available
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:mt-32 mt-12 justify-between items-center mx-auto container text-center ">
          <h1 className="text-center lg:text-4xl text-2xl font-semibold mb-5 text-newGray sm:mt-0">
            Why you choose us ?
          </h1>
          <p className="text-newGray  lg:text-lg sm:block sm:text-sm text-xs">
            we provide happiness through product of shop, groceries and <br />{" "}
            everyday essentials. How? By making ordering easy, fast and fun.
          </p>
          {/* <p className='sm:hidden ml-3 text-sm text-newGray xl:hidden lg:hidden md:hidden inline-block'>we provide happiness through product of shop, groceries and everyday essentials. <br />   How? By making ordering easy, fast and fun.</p> */}
        </div>
        <div className="lg:mt-32 mt-12 justify-between items-center mx-auto container  w-full">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            autoplay={{ delay: "2000", disableOnInteraction: false }}
            loop={true}
            speed={500}
            slidesPerView={"auto"}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 2,
              slideShadows: true,
            }}
            modules={[Autoplay, EffectCoverflow]}
            className="swiper_container"
          >
            <SwiperSlide className="flex flex-col relative rounded-lg">
              <div className="lg:w-1/2 w-2/3 lg:left-2 h-full relative">
                <div className="sm:top-14 top-6 absolute lg:left-3 ">
                  <h1 className="text-primary text-center font-semibold sm:ml-2 lg:ml-2 ml-16 sm:text-xl text-lg">
                    {" "}
                    Shop with confidence
                  </h1>
                  <p className="text-newGray sm:ml-4 mt-3 font-semibold sm:text-lg ml-20 text-md">
                    Confident using our service to make purchase less worrying.
                  </p>
                </div>
              </div>
              <img
                src={require("../../assets/images/Landing/Image 1.png")}
                alt="slide_image"
                className=" absolute lg:top-14 top-6 lg:right-5 right-12 sm:right-0 sm:w-8 sm:top-12"
              />
            </SwiperSlide>
            <SwiperSlide className="flex flex-col relative rounded-lg">
              <div className="sm:w-1/2 sm:left-2 lg:w-2/3 w-1/2 h-full relative">
                <div className="sm:top-14 top-8 absolute">
                  <h1 className="text-primary text-center font-semibold sm:text-xl sm:ml-5 ml-16 text-lg">
                    {" "}
                    Buy large volume
                  </h1>
                  <p className="text-newGray  mt-3 sm:text-lg font-semibold sm:ml-5 ml-16 text-md">
                    Purchase goods with <br />
                    large volumes and reasonable price.
                  </p>
                </div>
              </div>
              <img
                src={require("../../assets/images/Landing/Image 2.png")}
                alt="slide_image"
                className="absolute sm:top-14 top-4 right-6 w-1000 "
              />
            </SwiperSlide>
            <SwiperSlide className="flex flex-col relative rounded-lg">
              <div className="sm:w-1/2 sm:left-2 lg:w-2/3 w-1/2 h-full relative">
                <div className="sm:top-14 top-8 absolute">
                  <h1 className="text-primary text-center font-semibold sm:text-xl sm:ml-5 ml-16 text-lg">
                    {" "}
                    Buy large volume
                  </h1>
                  <p className="text-newGray  mt-3 sm:text-lg font-semibold sm:ml-5 ml-16 text-md">
                    Purchase goods with <br />
                    large volumes and reasonable price.
                  </p>
                </div>
              </div>
              <img
                src={require("../../assets/images/Landing/Image 2.png")}
                alt="slide_image"
                className="absolute sm:top-14 top-4 right-6 w-1000 "
              />
            </SwiperSlide>
            <SwiperSlide className="flex flex-col relative rounded-lg">
              <div className="lg:w-1/2 w-2/3 lg:left-2 h-full relative">
                <div className="sm:top-14 top-6 absolute lg:left-3 ">
                  <h1 className="text-primary text-center font-semibold sm:ml-2 lg:ml-2 ml-16 sm:text-xl text-lg">
                    {" "}
                    Shop with confidence
                  </h1>
                  <p className="text-newGray sm:ml-4 mt-3 font-semibold sm:text-lg ml-20 text-md">
                    Confident using our service to make purchase less worrying.
                  </p>
                </div>
              </div>
              <img
                src={require("../../assets/images/Landing/Image 1.png")}
                alt="slide_image"
                className=" absolute lg:top-14 top-6 lg:right-5 right-12 sm:right-0 sm:w-8 sm:top-12"
              />
            </SwiperSlide>
            <SwiperSlide className="flex flex-col relative rounded-lg">
              <div className="sm:w-1/2 w-1/2 h-full relative">
                <div className="sm:top-14 sm:left-3 top-6 ml-4 absolute">
                  <h1 className="text-primary text-center font-semibold lg:text-xl text-lg ">
                    {" "}
                    Save Time
                  </h1>
                  <p className="text-newGray mt-3 lg:text-lg text-md sm:ml-5 ml-14 font-semibold">
                    Just a few click, you can purchase many kinds of products
                    anywhere.
                  </p>
                </div>
              </div>
              <img
                src={require("../../assets/images/Landing/Image 3.png")}
                alt="slide_image"
                className="img absolute sm:top-12 top-2 right-5 "
              />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="lg:mt-32 mt-16 flex flex-wrap justify-between items-center mx-auto container lg:mb-10 w-full -mb-14">
          <div className="w-1/2 lg:block hidden ">
            <img
              src={require("../../assets/images/Landing/Group 136.png")}
              alt="images"
              className="w-3/5 ml-32"
            />
          </div>
          <div className="lg:w-1/2 relative w-full sm:ml-2 lg:ml-0">
            <hr className="border-dashed border-2 lg:top-40 md:top-48 left-15 lg:left-6 absolute border-primary lg:h-50 h-64 hidden lg:block  mt-32 lg:mt-0 md:h-72" />
            <h1 className="font-semibold lg:text-3xl text-xl text-newGray">
              How Does This Work ?
            </h1>
            <p className="text-newGray text-sm lg:text-lg mt-3">
              StockFlow Commerce is a platform that connects Products <br />
              with Distributors and Retailers
            </p>
            <div className="w-full flex flex-wrap sm:mt-10 mt-2 text-xl">
              <div className="sm:w-1/12 lg:w-1/6 w-1/6">
                <div className="lg:w-14 lg:h-14 w-7 h-7 rounded-full bg-primary relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute lg:h-8 lg:w-8 w-5 h-4 lg:left-3 lg:top-3 left-1 top-1 fill-white"
                    viewBox="0 0 640 512"
                  >
                    <path d="M0 488V171.3c0-26.2 15.9-49.7 40.2-59.4L308.1 4.8c7.6-3.1 16.1-3.1 23.8 0L599.8 111.9c24.3 9.7 40.2 33.3 40.2 59.4V488c0 13.3-10.7 24-24 24H568c-13.3 0-24-10.7-24-24V224c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32V488c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zm488 24l-336 0c-13.3 0-24-10.7-24-24V432H512l0 56c0 13.3-10.7 24-24 24zM128 400V336H512v64H128zm0-96V224H512l0 80H128z" />
                  </svg>
                </div>
              </div>
              <div className="sm:w-11/12 lg:w-5/6 w-5/6 text-sm lg:text-lg">
                <p className="font-semibold text-primary">
                  Sign up your account
                </p>
                <p className="text-newGray">
                  We'll take you to Google to verify that you own this email
                  address. We <br />
                  will not see your Google password.
                </p>
              </div>
            </div>
            <div className="w-full flex flex-wrap sm:mt-10 mt-2 text-xl">
              <div className="sm:w-1/12 lg:w-1/6 w-1/6">
                <div className="lg:w-14 lg:h-14 w-7 h-7 rounded-full bg-primary relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute lg:h-8 lg:w-8 w-5 h-4 lg:left-3 lg:top-3 left-1 top-1 fill-white"
                    viewBox="0 0 640 512"
                  >
                    <path d="M0 488V171.3c0-26.2 15.9-49.7 40.2-59.4L308.1 4.8c7.6-3.1 16.1-3.1 23.8 0L599.8 111.9c24.3 9.7 40.2 33.3 40.2 59.4V488c0 13.3-10.7 24-24 24H568c-13.3 0-24-10.7-24-24V224c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32V488c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zm488 24l-336 0c-13.3 0-24-10.7-24-24V432H512l0 56c0 13.3-10.7 24-24 24zM128 400V336H512v64H128zm0-96V224H512l0 80H128z" />
                  </svg>
                </div>
              </div>
              <div className="sm:w-11/12 lg:w-5/6 w-5/6 bg-white text-sm lg:text-lg">
                <p className="font-semibold text-primary">
                  Choose Role to set up account
                </p>
                <p className="text-newGray">
                  After sign up into our website we will let's you pick up the
                  role. Whether <br />
                  you want to be distributor or retailer.
                </p>
              </div>
            </div>
            <div className="w-full flex flex-wrap sm:mt-10 mt-2 text-xl">
              <div className="sm:w-1/12 lg:w-1/6 w-1/6">
                <div className="lg:w-14 lg:h-14 w-7 h-7 rounded-full bg-primary relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute lg:h-8 lg:w-8 w-5 h-4 lg:left-3 lg:top-3 left-1 top-1 fill-white"
                    viewBox="0 0 640 512"
                  >
                    <path d="M0 488V171.3c0-26.2 15.9-49.7 40.2-59.4L308.1 4.8c7.6-3.1 16.1-3.1 23.8 0L599.8 111.9c24.3 9.7 40.2 33.3 40.2 59.4V488c0 13.3-10.7 24-24 24H568c-13.3 0-24-10.7-24-24V224c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32V488c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zm488 24l-336 0c-13.3 0-24-10.7-24-24V432H512l0 56c0 13.3-10.7 24-24 24zM128 400V336H512v64H128zm0-96V224H512l0 80H128z" />
                  </svg>
                </div>
              </div>
              <div className="sm:w-11/12 lg:w-5/6 w-5/6 bg-white text-sm lg:text-lg">
                <p className="font-semibold text-primary">Head Online</p>
                <p className="text-newGray">
                  When you already setup account, you can enjoy using our
                  platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="bg-primary">
        {/* <div class="container mx-auto grid grid-cols-3 gap-3 py-4 ">
                    <div className='mt-4'>
                        <a href="#" class="flex items-center">
                            <img src={require("../../assets/images/Landing/logo.png")} class="lg:h-28 lg:mr-3 mr-1 h-16" alt="FlowBite Logo" />
                            <span class="self-center lg:text-xl text-lg font-semibold whitespace-nowrap dark:text-white text-white">Warehouse <br />Master</span>
                        </a>
                    </div>
                <div>
                    <div>
                        <h1 className='lg:text-xl font-semibold text-white md:text-xl text-lg'>About us</h1>
                        <p className='mt-2 mb-4 text-white text-sm lg:text-lg '>11th generation student of korea<br /> software HRD center</p>
                        <div className=' flex md:mt-0'>
                            <a href="" className='mr-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" className='text-red-500 lg:h-5 h-4 fill-white' viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" /></svg>
                            </a>
                            <a href="" className='mr-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='lg:h-5 h-4 fill-white'><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg>
                            </a>
                            <a href="" className='mr-4'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className='lg:h-5 h-4 fill-white'><path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='text-white'>
                    <div className='md:text-2xl md:ml-28'>
                        <h1 className='lg:text-xl text-lg font-semibold md:text-xl '>Contact Us</h1>
                        <div className='flex flex-wrap mt-2 '>
                            <svg xmlns="http://www.w3.org/2000/svg" className='lg:h-4 h-4 lg:mt-1 fill-white' viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" /></svg>
                            <p className='ml-2 lg:text-lg text-sm'>+855 12 850 001</p>
                        </div>
                        <div className='flex flex-wrap mt-2 '>
                            <svg xmlns="http://www.w3.org/2000/svg" className='lg:h-4 h-4 lg:mt-1 fill-white' viewBox="0 0 512 512"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" /></svg>
                            <p className='ml-2 lg:text-lg text-xs '>warehousemaster@gmail.com</p>
                        </div>
                        <div className='flex flex-wrap mt-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='lg:h-4 h-4 lg:mt-1 fill-white' viewBox="0 0 448 512"><path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z" /></svg>
                            <p className='ml-2 lg:text-lg text-sm'>Mon-Sun: 8am-9pm</p>
                        </div>
                    </div>
                </div>
                </div>
                <div className=' w-full text-center container mx-auto'>
                    <span class="w-full text-xs text-white lg:text-sm text-center">©2023 warehousemaster team. All Rights Reserved.
                    </span>
                </div> */}
        <div class="w-full mx-auto container sm:pb-0 sm:py-2 lg:pt-4">
          <div class="md:flex md:justify-between ">
            <div class="w-1/3 lg:mb-6 md:mb-0 lg:mt-5 md:mt-5">
              <a href="#" class="flex items-center">
                <img
                  src={require("../../assets/images/Landing/logo.png")}
                  class="lg:h-36 lg:w-36 h-16"
                  alt="FlowBite Logo"
                />
                <span class="self-center lg:text-xl text-lg font-semibold whitespace-nowrap dark:text-white text-white">
                  Warehouse <br />
                  Master
                </span>
              </a>
            </div>
            <div class="lg:w-2/3 w-full  grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2 mt-3">
              <div className="lg:w-2/3 w-full sm:ml-1 lg:ml-0">
                <h1 className="lg:text-xl font-semibold text-white md:text-xl sm:text-lg text-md">
                  About us
                </h1>
                <p className="mt-2 lg:mb-4 mb-2 text-white lg:text-lg sm:text-sm text-xs w-full">
                  11th generation student of korea software HRD center
                </p>
                <div className=" flex md:mt-0">
                  <a href="" className="mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-red-500 lg:h-7 h-4 fill-white"
                      viewBox="0 0 320 512"
                    >
                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                  </a>
                  <a href="" className="mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="lg:h-7 h-4 fill-white"
                    >
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                  </a>
                  <a href="" className="mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 496 512"
                      className="lg:h-7 h-4 fill-white"
                    >
                      <path d="M248,8C111.033,8,0,119.033,0,256S111.033,504,248,504,496,392.967,496,256,384.967,8,248,8ZM362.952,176.66c-3.732,39.215-19.881,134.378-28.1,178.3-3.476,18.584-10.322,24.816-16.948,25.425-14.4,1.326-25.338-9.517-39.287-18.661-21.827-14.308-34.158-23.215-55.346-37.177-24.485-16.135-8.612-25,5.342-39.5,3.652-3.793,67.107-61.51,68.335-66.746.153-.655.3-3.1-1.154-4.384s-3.59-.849-5.135-.5q-3.283.746-104.608,69.142-14.845,10.194-26.894,9.934c-8.855-.191-25.888-5.006-38.551-9.123-15.531-5.048-27.875-7.717-26.8-16.291q.84-6.7,18.45-13.7,108.446-47.248,144.628-62.3c68.872-28.647,83.183-33.623,92.511-33.789,2.052-.034,6.639.474,9.61,2.885a10.452,10.452,0,0,1,3.53,6.716A43.765,43.765,0,0,1,362.952,176.66Z" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="text-white w-full ">
                <div className="lg:text-2xl lg:ml-28 sm:ml-20">
                  <h1 className="font-semibold lg:text-xl md:text-xl sm:text-lg text-md ">
                    Contact Us
                  </h1>
                  <div className="flex flex-wrap mt-2 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="lg:h-4 h-4 lg:mt-1 fill-white"
                      viewBox="0 0 512 512"
                    >
                      <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                    </svg>
                    <p className="ml-2 lg:text-lg sm:text-sm text-xs">
                      +855 12 850 001
                    </p>
                  </div>
                  <div className="flex flex-wrap mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="lg:h-4 h-4 lg:mt-1 fill-white hidden xl:inline-block sm:inline-block"
                      viewBox="0 0 512 512"
                    >
                      <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                    </svg>
                    <p className="lg:text-lg text-xs sm:mr-5 mr-2 ml-2 hidden xl:inline-block sm:inline-block sm:text-sm ">
                      warehousems@gmail.com
                      <p className="xl:hidden sm:hidden inline-block">
                        warehouse <br /> @gmail.com
                      </p>
                    </p>
                  </div>
                  <div className="flex flex-wrap mt-2 lg:hidden block sm:hidden ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="lg:h-4 h-4 lg:mt-1 fill-white"
                      viewBox="0 0 512 512"
                    >
                      <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                    </svg>
                    <p className="lg:ml-2 ml-2 lg:text-lg text-xs ">
                      warehousems@ <br /> gmail.com
                    </p>
                  </div>
                  <div className="flex flex-wrap mt-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="lg:h-4 h-4 lg:mt-1 fill-white"
                      viewBox="0 0 448 512"
                    >
                      <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z" />
                    </svg>
                    <p className="lg:ml-2 ml-1 lg:text-lg text-xs sm:text-sm">
                      Mon-Sun: 8am-9pm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="sm:flex sm:items-center sm:justify-between lg:mt-3 mt-2 ">
            <span class="w-full text-center text-xs text-white sm:text-center dark:text-white lg:text-lg mb-5">
              ©2023 warehousemaster teeam. All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

