import React, { useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import '../App.css';

import { toast } from 'react-toastify'
// import contractData from '../contract.json'
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai"
import { FaRegShareSquare } from "react-icons/fa";



function Cards({ item, currNft, player, setPlayer, setCurrNft, account, idx, processing, setProcessing, marketplace }) {

  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  // console.log(processing);
  const handleLike = () => {
    if (disliked) {
      setDisliked(false);
    }
    setLiked(!liked);
  }
  const handleDislike = () => {
    if (liked) {
      setLiked(false);
    }
    setDisliked(!disliked);
  }

  async function handlePayment(item) {
    setProcessing(true)
    try {
      const marketplacecontract = marketplace
      console.log(marketplacecontract);

      const price = ethers.utils.parseEther((item.price).toString());
      console.log("price to pay: " + price);
      const tx = await marketplacecontract.watchVideo(idx, {
        value: (price) // Assuming you have apartment price
      });      // Send the transaction (assuming signer has sufficient funds)

      toast.info("Your transaction is being processed", {
        position: "top-center"
      })
      await tx.wait();
      toast.success("Transaction successful!", { position: "top-center" })
      // console.log("Transaction successful:", receipt);
      setPlayer(true);
      setCurrNft(item)
      // console.log(receipt.transactionHash);

    } catch (error) {
      console.log(error);

    }
    setProcessing(false)
  }

  // const [thumbnail, setThumbnail] = useState('');
  // const videoRef = useRef(null);
  // const handleVideoLoaded = () => {
  //   if (videoRef.current) {
  //     const canvas = document.createElement('canvas');
  //     canvas.width = 230; // Set to your desired width
  //     canvas.height = (videoRef.current.videoHeight / videoRef.current.videoWidth) * canvas.width;
  //     const context = canvas.getContext('2d');
  //     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  //     setThumbnail(canvas.toDataURL());
  //   }
  // };

  return (
    <div className='card-div'>
      <div className='card-inner p-2'>
        {/* {thumbnail ? (
          <img src={thumbnail} alt="" className="card-img-top" style={{ height: "auto", width: "230px" }} />
        ):( */}
          <video
          // ref={videoRef}
          className="card-img-top"
          alt="NFT"
          src={item.file}
          controls={false}
          autoPlay={false}
          // onLoadedMetadata={handleVideoLoaded}
          style={{ height: "auto", width: "230px" }}
          >
        </video>
        {/*  )} */}
        <div className='flex flex-col justify-center items-center'>
          <h3 className='text-white text-2xl font-thin mt-3'>{item.name}</h3>
          <h4 className='text-white text-2xl font-thin mt-3'>Price: <span className='text-green-400'><strong>{item.price} </strong></span> ETH</h4>
          <div className='flex text-white justify-between items-center mb-3 gap-4 mt-3'>
            {!player &&
              <button type="button" class="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded text-sm px-5 py-1.5 text-center me-2 " disabled={processing} onClick={() => { handlePayment(item) }}>Watch Video</button>
            }
          </div>
          <div className='flex justify-center items-center gap-4 mt-2'>
            <button
              type="button"
              className={`flex items-center gap-2 text-white ${liked ? "bg-green-500" : " border border-green-500"} font-medium rounded text-sm px-4 py-1.5 text-center`}
              onClick={() => handleLike(item)}
            >
              <AiOutlineLike />
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 text-white ${disliked ? "bg-red-500" : "border border-red-500"} font-medium rounded text-sm px-4 py-1.5 text-center`}
              onClick={() => handleDislike(item)}
            >
              <AiOutlineDislike />
            </button>
            <button
              type="button"
              className="flex items-center gap-2 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-4 py-1.5 text-center"
              onClick={() => {
                navigator.clipboard.writeText("https://video-nft-kaia.netlify.app/")
                  .then(() => {
                    toast.success("Link copied to clipboard!", {
                      position: "top-center"
                    }); // Optional: Notify the user
                  })
                  .catch(err => {
                    console.error("Failed to copy: ", err); // Handle error
                  });
              }}
            >
              <FaRegShareSquare /> Share
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cards