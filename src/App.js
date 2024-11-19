import './App.css';
import Nav from './components/Nav';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import Home from './components/Home';
import NFTs from './components/NFTs';
import Create from './components/Create';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

// import Web3 from 'web3';
import contractData from './contract.json'
import { toast } from 'react-toastify'
import { ethers } from 'ethers';


function App() {

  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [marketplace, setMarketplace] = useState({});
  const [nftitem, setNFTitem] = useState({})
  const [correctNetwork, setCorrectNetwork] = useState(false)
  const [chainId, setChainId] = useState(null)
  const correctId = 1001;

  window.ethereum.on("chainChanged", (newChain) => {
    setChainId(newChain);
    console.log(newChain);
    console.log(chainId);
    window.location.href = "/"; // Redirect using window.location
    // window.location.reload()
  });

  window.ethereum.on("accountsChanged", () => {
    window.location.href = "/"; // Redirect using window.location
    // window.location.reload();
  });

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x3e9' }], // Chain ID 1001 in hex format
      });
    } catch (error) {
      toast.error("Some error occured while switching network", {
        position: "top-center"
      })
      console.log(error);
    }
  }

  useEffect(() => {
    if (chainId !== correctId) {
      console.log("curr chain: " + chainId);
      setCorrectNetwork(false);
      switchNetwork()
    } else if (chainId === correctId) {
      console.log("curr chain: " + chainId);
      setCorrectNetwork(true);
    }
  }, [chainId])


  useEffect(() => {
    setLoading(true)
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setLoading(false)
        let marketplaceAddress = contractData.address;


        const marketplacecontract = new ethers.Contract(
          marketplaceAddress,
          contractData.abi,
          signer
        );
        console.log(marketplacecontract);

        setMarketplace(marketplacecontract);
        // console.log("contr "+marketplace);
        const chain = await provider.getNetwork();
        setChainId(Number(chain.chainId))
        console.log(chainId);
        setLoading(false);
        if (chainId === correctId) {
          setCorrectNetwork(true);
        }
      } else {
        console.error("Metamask is not installed");
      }
    };

    provider && loadProvider();
    setLoading(false)
  }, []);


  return (
    <BrowserRouter>
      <ToastContainer />
      <div className="App min-h-screen">
        <div className='gradient-bg-welcome h-screen w-screen'>
          <Nav account={account} loading={loading} />
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/all-nft" element={<NFTs marketplace={marketplace} setNFTitem={setNFTitem} account={account} setMarketplace={setMarketplace} />}></Route>
            <Route path="/create" element={<Create marketplace={marketplace} account={account} setMarketplace={setMarketplace} />}></Route>
          </Routes>
        </div>
      </div>

    </BrowserRouter>
  );
}

export default App;
