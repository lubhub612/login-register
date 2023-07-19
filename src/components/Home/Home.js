import React, { useState, useEffect } from "react";
import MLM from "../contract/MLM";
import TOKEN from "../contract/Token";
import MLMnew from "../contract/MLMnew";
import ClientTOKEN from "../contract/ClientToken";
import USDTTOKEN from "../contract/USDTToken";
import { ToastContainer, toast } from "react-toastify";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { errors, providers } from "ethers";
import bigInt from "big-integer";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

export default function Home() {
  const [isOwner, setIsOwner] = useState(false);
  const [estimateValue, setEstimateValue] = useState("");
  const [estimateWithdrawValue, setEstimateWithdrawValue] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [withdrawValue, setWithdrawValue] = useState(0);
  const [handleWithdrawLoader, setHandleWithdrawLoader] = useState(false);
  const [userWithdrawBalance, setUserWithdrawBalance] = useState(0);
  const [userValid, setUserValid] = useState(false);
  const [tokenPrice, setTokePrice] = useState(0);
  const [show, setShow] = useState(false);
  const [popUpwithdrawValue, setPopupWithdrawValue] = useState("");
  const [popUpClaimValue, setPopupClaimValue] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [buttonStatus, setButtonStatus] = useState("");
  const [toggleCard, setToggleCard] = useState("deposit");
  const [depositAmount, setDepositamount] = useState('');
  const [tokenValue, setTokenValue] = useState('USDT');
  const [approveBtn, setApproveBtn] = useState(true);
  const [refId, setRefId] = useState("");
  const [enterAddress, setEnterAddress] = useState("");
  const handleClose = () => setShow(false);
  // const handleShow = () => {
  //   console.log('handle show withdraw');
  //   setShow(true);

  //   getPopUpValue();
  // };

  useEffect(() => {
    handleUrl();
    return () => {};
  }, []);

  const handleUrl = () => {
    try {
      let url = window.location.href;
      let id = url.split("=")[1];
      setRefId(id);
      console.log("🚀 ~ handleUrl ~ id", id);
      console.log("🚀 ~ handleUrl ~ url", url);
    } catch (error) {
      console.log("🚀 ~ handleUrl ~ error", error);
    }
  };

  // const web3Provider = new providers.Web3Provider(provider);

  useEffect(() => {
    if (userAddress) {
      getUserWalletBalance();
    }
    return () => {};
  }, [userAddress]);

  const handleWalletConnect = async () => {
    // try {
    //   await provider.enable();
    // } catch (error) {}
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
          } else {
            console.error(err);
          }
        });
      return true;
    } else {
      console.log("Please connect to MetaMask.");
      return false;
    }
  };
  function handleAccountsChanged(accounts) {
    let currentAccount;

    if (window.ethereum) {
      if (window.ethereum.networkVersion !== "80001") {
        toast.error("Please connect to Polygon  Testnet");
      }
    }

    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      // console.log("Please connect to MetaMask.");
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      setUserAddress(currentAccount);

      // Do any other work!
    }
  }
  //

  const _estimatedCreditValue = async (val) => {
    console.log("🚀 ~ const_estimatedCreditValue= ~ val", val);
    try {
      if (val < 1) {
        return setEstimateWithdrawValue("0");
      }
      let _val = await MLM.estimateWithdrawToken(val);
      setEstimateWithdrawValue(_val.toString());
    } catch (error) {
      console.log("🚀 ~ const_estimatedCreditValue=async ~ error", error);
    }
  };

  const getUserWalletBalance = async () => {
    try {
      let url = `https://metabitclub.com/dashboard/b59c67bf196a4758191e42f76670cebaAPI/balance.php?address=${userAddress}`;
      let bal = await axios.get(url).then((res, err) => {
        if (err) {
          setUserValid(false);
          console.log("err", err);
        }
        if (res) {
          console.log("🚀 ~ bal ~ res", res);
          setUserValid(true);
          return res;
        }
      });
      console.log("🚀 ~ bal ~ bal", bal);
      if (bal.data == "Not Valid") {
        setUserWithdrawBalance(0);
      } else {
        setUserWithdrawBalance(bal.data);
      }
    } catch (error) {
      console.log("🚀 ~ getUserWalletBalance ~ error", error);
    }
  };

  const getEstimateToken = async (val) => {
    // console.log('🚀 ~ getEstimateToken ~ val', val);
    // if (val > 0) {
    //   let amount = await MLM.estimateToken(val);
    //   console.log('🚀 ~ getEstimateToken ~ amount', amount);
    //   setEstimateValue(amount.toString());
    // } else {
    //   setEstimateValue('0');
    // }
  };

  const _handleApprove = async () => {
    try {
      // let _approveAmount = await MLM.estimateToken(depositAmount);

      setButtonStatus("approve");
      let depostiAm = bigInt(depositAmount * 10 ** 18);
      console.log(
        "🚀 ~ const_handleApprove= ~ depostiAm",
        depostiAm.toString()
      );

      let add = MLM.address;
      let _amount = await TOKEN.approve(add, depostiAm.toString());
      let _wait = await _amount.wait();
      if (_wait) {
        setButtonStatus("");
        setApproveBtn(false);

        toast.success("Approve success!");
      }
    } catch (error) {
      setButtonStatus("");
      setApproveBtn(true);

      console.log("🚀 ~ const_handleApprove=async ~ error", error);
      toast.error("Something went wrong!");
    }
  };

  const handleApproveToken = async () => {
    if (!userAddress) {
      return toast.error("Please connect wallet first!");
    }
    if (!tokenValue) {
      return toast.error("Please choose token first!");
    }
    try {
      // let _approveAmount = await MLM.estimateToken(depositAmount);

      setButtonStatus("approve");


      if(tokenValue === 'DOT') {

      let add = MLMnew.address;
      let depostiAm = bigInt(depositAmount * 10 ** 18);
      console.log(
        "🚀 ~ const_handleApprove= ~ depostiAm",
        depostiAm.toString()
      );
      let _amount = await ClientTOKEN.approve(add, depostiAm.toString());
      let _wait = await _amount.wait();
      if (_wait) {
        setButtonStatus("");
        setApproveBtn(false);

        toast.success("Approve success!");
      }
    } else {
      let add = MLMnew.address;
      let depostiAm = bigInt(depositAmount * 10 ** 18);
      console.log(
        "🚀 ~ const_handleApprove= ~ depostiAm",
        depostiAm.toString()
      );
      let _amount = await USDTTOKEN.approve(add, depostiAm.toString());
      let _wait = await _amount.wait();
      if (_wait) {
        setButtonStatus("");
        setApproveBtn(false);

        toast.success("Approve success!");
      }
    }
    } catch (error) {
      setButtonStatus("");
      setApproveBtn(true);

      console.log("🚀 ~ const_handleApprove=async ~ error", error);
      toast.error("Something went wrong!");
    }
  };


  const _handleDeposit = async () => {
    if (!userAddress) {
      return toast.error("Please connect wallet first!");
    }

    try {
      setButtonStatus("deposit");
      let depostiAm = bigInt(depositAmount * 10 ** 18);

      let _deposit = await MLM._depositBusd(depostiAm.toString());
      let _wait = await _deposit.wait();
      if (_wait) {
        let formData = new FormData();
        formData.append("address", userAddress);
        formData.append("amount", depositAmount);
        let depositApi = await axios.post(
          `https://metabitclub.com/dashboard/b59c67bf196a4758191e42f76670cebaAPI/topup.php`,
          formData
        );
        console.log("🚀 ~ const_handleDeposit= ~ depositApi", depositApi);
        setButtonStatus("");
        setApproveBtn(true);
        toast.success("Deposit success!");
        getUserWalletBalance();
      }
    } catch (error) {
      console.log("🚀 ~ const_handleDeposit= ~ error", error);
      let _par = JSON.stringify(error);
      let _parse = JSON.parse(_par);
      if (_parse?.reason) {
        toast.error(_parse?.reason);
      } else {
        toast.error("Something went wrong!");
      }
      console.log("🚀 ~ const_handleDeposit= ~ _parse", _parse);

      setButtonStatus("");
      console.log("🚀 ~ const_handleDeposit= ~ error", error);
      // setApproveBtn(true);
    }
  };

  const handleDepositToken = async () => {
    if (!userAddress) {
      return toast.error("Please connect wallet first!");
    }

    if (!tokenValue) {
      return toast.error("Please choose token first!");
    }

    try {
      setButtonStatus("deposit");
      let depostiAm = bigInt(depositAmount * 10 ** 18);
if(tokenValue === 'DOT') {
      let _deposit = await MLMnew._depositCoin(Number(1), depostiAm.toString());
      let _wait = await _deposit.wait();
      if (_wait) {
        let formData = new FormData();
        formData.append("address", userAddress);
        formData.append("amount", depositAmount);
        let depositApi = await axios.post(
          `https://metabitclub.com/dashboard/b59c67bf196a4758191e42f76670cebaAPI/topup.php`,
          formData
        );
        console.log("🚀 ~ const_handleDeposit= ~ depositApi", depositApi);
        setButtonStatus("");
        setApproveBtn(true);
        toast.success("Deposit success!");
        getUserWalletBalance();
      }
    } else {
      let _deposit = await MLMnew._depositCoin(Number(0), depostiAm.toString());
      let _wait = await _deposit.wait();
      if (_wait) {
        let formData = new FormData();
        formData.append("address", userAddress);
        formData.append("amount", depositAmount);
        let depositApi = await axios.post(
          `https://metabitclub.com/dashboard/b59c67bf196a4758191e42f76670cebaAPI/topup.php`,
          formData
        );
        console.log("🚀 ~ const_handleDeposit= ~ depositApi", depositApi);
        setButtonStatus("");
        setApproveBtn(true);
        toast.success("Deposit success!");
        getUserWalletBalance();
      }
    }   
    } catch (error) {
      console.log("🚀 ~ const_handleDeposit= ~ error", error);
      let _par = JSON.stringify(error);
      let _parse = JSON.parse(_par);
      if (_parse?.reason) {
        toast.error(_parse?.reason);
      } else {
        toast.error("Something went wrong!");
      }
      console.log("🚀 ~ const_handleDeposit= ~ _parse", _parse);

      setButtonStatus("");
      console.log("🚀 ~ const_handleDeposit= ~ error", error);
      // setApproveBtn(true);
    }
  };

  useEffect(() => {
    getAdmin();
    return () => {};
  }, [userAddress]);

  const getAdmin = async () => {
    console.log("🚀 ~ getAdmin ~ userAddress", userAddress);
    try {
      if (userAddress) {
        let owner = await MLM.owner();
        console.log("🚀 ~ getAdmin ~ owner", owner);
        console.log("🚀 ~ getAdmin ~ userAddress", userAddress);
        if (userAddress.toLowerCase() == owner.toLowerCase()) {
          console.log("valid");
          setIsOwner(true);
        }
      }
    } catch (error) {
      console.log("🚀 ~ getAdmin ~ error", error);
    }
  };

  return (
    <>
      <ToastContainer autoClose={3000} />
      <div className="">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="logo"></div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className='row'>
        <div className='col-md-12  d-flex justify-content-center'>
          {isOwner ? (
            <Link
              to={'/admin'}
              className='dashBoard wallet  btn btn-outline border-white text-white withdrawButton'
            >
              Admin
            </Link>
          ) : (
            ''
          )}
        </div>
      </div> */}

      {/* handle address  */}

      {/* handle login  */}
      {/* {!isValid ? (
        <div className="container -fluid ">
          <div className="row mt-5">
            <div className="col-12">
              <div className="row d-flex justify-content-center">
                <div
                  className="col-lg-5 col-md-8  p-4 m-2 shadow2 rounded-1 "
                  style={{
                    backgroundColor: 'rgb(20 21 51)'
                  }}
                >
                  <div className="col py-4 ">
                    <div className="row">
                      <div className="col-md-12 d-flex justify-content-center">
                        <img
                          src="./assets/sss_world.png"
                          // className="img-fluid"
                          alt="logo"
                          loading="lazy"
                          // height={150}
                          className="myImg"
                        />
                      </div>
                    </div>

                    <div className="row py-3">
                      <div className="col-12 d-flex  justify-content-center">
                        <input
                          type="text"
                          class="form-control"
                          id="exampleFormControlInput1"
                          disabled
                          value={userAddress}
                          placeholder=" Wallet Address"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col d-flex justify-content-center">
                        {buttonStatus === 'login' ? (
                          <div
                            class="spinner-border text-success"
                            role="status"
                          >
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <button
                            onClick={handleUserLogin}
                            className="btn btn-outline border-white text-white withdrawButton"
                          >
                            Login
                          </button>
                        )}
                      </div>
                      <div className="col d-flex justify-content-center">
                        {buttonStatus === 'register' ? (
                          <div
                            class="spinner-border text-success"
                            role="status"
                          >
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <button
                            onClick={handleUserRegister}
                            className="btn btn-outline border-white text-white withdrawButton"
                          >
                            Register
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )} */}

      {/* withdraw  */}
      <div className="row m-0 p-0 ">
        <div className="col-12  col-md-6  mt-1 mt-md-4 d-flex d-md-block justify-content-center">
          <a
            href={`https://metabitclub.com/dashboard/home.php?address=${userAddress}`}
            className="dashboard "
          >
            Dashboard
          </a>
        </div>
        <div className="col-12  col-md-6  mt-1 mt-md-4 d-flex  justify-content-center justify-content-md-end ">
          {userAddress ? (
            <button
              className="dashBoard wallet  btn btn-outline border-white text-white withdrawButton"
              // onClick={handleWalletConnect}

              disabled
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                width: "160px",
                whiteSpace: "nowrap",
                color: "black",
              }}
            >
              {" "}
              {userAddress}
            </button>
          ) : (
            <button
              className=" wallet2 dashboard"
              onClick={handleWalletConnect}
            >
              {" "}
              Connect Wallet{" "}
            </button>
          )}
        </div>
      </div>
      {isValid ? (
        <div className="container mt-2 mt-md-5">
          <div className="container ">
            <div className="row d-flex justify-content-center">
              <div
                className="col-lg-5 col-md-8  p-2 m-2 shadow2 rounded-1"
                style={{
                  backgroundColor: "rgb(20 21 51)",
                }}
              >
                {toggleCard === "deposit" ? (
                  <div className="row">
                    <div className="col pb-4 pt-1">
                      <div className="row ">
                        <div className="col-12 d-grid justify-content-center">
                          <img
                            src="https://metabitclub.com/images/navLogo.png"
                            alt="metabit"
                          />
                          <h2 className="text-center text-center pb-2 text-white">
                            DEPOSIT
                          </h2>
                        </div>
                        <div className="col-12 ">
                          <p
                            className="ps-2  border mx-3 py-2 "
                            style={{
                              backgroundColor: "#D9D9D9",
                              borderRadius: "5px",
                              color: "#2f323b ",
                              fontWeight: "500",
                              fontSize: "20px",
                            }}
                          >
                            (My Balance) - ({userWithdrawBalance}
                            {" USDT"})
                          </p>
                        </div>
                      </div>
                      <div className="row  mx-2">
                       {/*} <div className="col pt-2">
                          <label htmlFor="input " className="pb-2 text-white">
                            {" "}
                            Enter USD Amount
                          </label>
                          <input
                            style={{
                              backgroundColor: "#D9D9D9",
                              borderRadius: "5px",
                              color: "#2f323b ",
                              fontWeight: "500",
                              fontSize: "18px",
                            }}
                            className="form-control "
                            type="text"
                            placeholder="Enter Value"
                            aria-label="default input example"
                            value={depositAmount}
                            onChange={(e) => {
                              setDepositamount(e.target.value);
                              getEstimateToken(e.target.value);
                            }}
                          />
                          <p
                            className="text-white pt-2"
                            style={{ fontSize: "12px" }}
                          >
                            DEBIT : {estimateValue ?? "0"} BUSD
                          </p>
                        </div> */}
                        
                      <div className='col d-flex justify-content-center'>
                    {/*}  <label htmlFor='input ' className='pb-2' 
                           style={{
                            color: 'rgb(255 255 255)',
                         }}>
                            {' '}
                            Enter Amount
                        </label>  */}
                        <select value={tokenValue}  onChange={(e) => setTokenValue(e.target.value)}  style= {{backgroundColor: ' rgba(0, 0, 0, 0.5)',  color: 'rgb(255 255 255)',  border: '8' , background: 'none' }}>
                            <option value="USDT">USDT</option>
                            <option value="DOT">TOKEN</option>
                         </select>
                      </div>
                      <div className='col d-flex justify-content-center'>
                      <input
                            style={{
                              backgroundColor: "#D9D9D9",
                              borderRadius: "5px",
                              color: "#2f323b ",
                              fontWeight: "500",
                              fontSize: "18px",
                            }}
                            className="form-control "
                            type="text"
                            placeholder="Enter Token Value"
                            aria-label="default input example"
                            value={depositAmount}
                            onChange={(e) => {
                              setDepositamount(e.target.value);
                              getEstimateToken(e.target.value);
                            }}
                          />
                          
                         
                      </div>
                    
                      </div>
                      <div className="row mx-4">
                        <div className="ps-2   mx-3 py-2">
                        <p
                            className="text-white pt-2"
                            style={{ fontSize: "12px" }}
                          >
                            DEBIT : {depositAmount} {tokenValue}
                          </p>
                          </div>
                      </div>    
                    </div>

                    <div className="row   pb-4">
                      <div className="dashBoard dashBoard2 pt-4 text-center">
                        <>
                          {console.log("buttton", buttonStatus)}
                          {approveBtn ? (
                            <>
                              {buttonStatus === "approve" ? (
                                <div
                                  class="spinner-border text-success"
                                  role="status"
                                >
                                  <span class="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                              ) : (
                                <button
                                  className={`btn btn-outline border-white text-white  withdrawButton`}
                                 // onClick={_handleApprove}
                                  // onClick={handleShow}
                                  onClick={handleApproveToken}
                                >
                                  APPROVE
                                </button>
                              )}{" "}
                            </>
                          ) : (
                            ""
                          )}
                          {!approveBtn ? (
                            <>
                              {buttonStatus === "deposit" ? (
                                <div
                                  class="spinner-border text-success"
                                  role="status"
                                >
                                  <span class="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                              ) : (
                                <button
                                  className={`btn btn-outline border-white text-white  withdrawButton`}
                                  //onClick={_handleDeposit}
                                  // onClick={handleShow}handleDepositToken
                                  onClick={handleDepositToken}
                                >
                                  Deposit
                                </button>
                              )}{" "}
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {toggleCard === "withdraw" ? (
                  <div className="row">
                    <div className="col py-4 ">
                      <div className="row ">
                        <div className="col-12">
                          <h2 className="text-center pb-4">WITHDRAWAL</h2>
                        </div>
                        <div className="col-12 ">
                          <p
                            className="ps-2  border mx-3 py-2 "
                            style={{
                              backgroundColor: "#D9D9D9",
                              borderRadius: "5px",
                              color: "#2f323b ",
                              fontWeight: "500",
                              fontSize: "20px",
                            }}
                          >
                            (My Balance) - ({userWithdrawBalance}
                            {" SSCOIN"})
                          </p>
                        </div>
                      </div>
                      <div className="row  mx-2 ">
                        <div className="col pt-2">
                          <label htmlFor="input " className="pb-2">
                            {" "}
                            Enter USD Amount
                          </label>
                          <input
                            style={{
                              backgroundColor: "#D9D9D9",
                              borderRadius: "5px",
                              color: "#2f323b ",
                              fontWeight: "500",
                              fontSize: "18px",
                            }}
                            className="form-control "
                            type="text"
                            placeholder="Enter Value"
                            aria-label="default input example"
                            value={withdrawValue}
                            onChange={(e) => {
                              setWithdrawValue(e.target.value);
                              _estimatedCreditValue(e.target.value);
                            }}
                          />
                          <p className="pt-2" style={{ fontSize: "12px" }}>
                            CREDIT : {estimateWithdrawValue ?? "0"} BUSD
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          {handleWithdrawLoader ? (
            <div
              className="alert alert-warning bg-danger text-light"
              role="alert"
            >
              Don't refresh the page, otherwise you lost your money.
            </div>
          ) : (
            ""
          )}

          
        </div>
      ) : (
        ""
      )}
    </>
  );
}
