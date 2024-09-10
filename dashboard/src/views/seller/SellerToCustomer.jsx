import React, { useEffect, useRef, useState } from 'react';
import { FaList } from 'react-icons/fa6';
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { get_customer_message, get_customers, messageClear, send_message, updateMessage } from '../../store/Reducers/chatReducer';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { socket } from '../../utils/utils';

const SellerToCustomer = () => {

    const scrollRef = useRef();

    const [show, setShow] = useState(false);
    const sellerId = 65;
    const { userInfo } = useSelector(state => state.auth);
    const { customers, messages, currentCustomer, successMessage } = useSelector(state => state.chat);
    const [text, setText] = useState('');
    const [receverMessage, setReceverMessage] = useState('');

    const { customerId } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(get_customers(userInfo._id));
    }, []);

    useEffect(() => {
        if (customerId) {
            dispatch(get_customer_message(customerId));
        }
    }, [customerId]);

    const send = (e) => {
        e.preventDefault();
        let sender = userInfo.name
        console.log("Sending message:", text);
        console.log("shop name", userInfo);
        dispatch(send_message({
            senderId: userInfo._id,
            receverId: customerId,
            text,
            name: userInfo.name
        }));
        setText('');
    }

    useEffect(() => {
        if (successMessage) {
            console.log("Latest message sent by the seller:", messages[messages.length - 1]);
            socket.emit('send_seller_message', messages[messages.length - 1]);
            dispatch(messageClear());
        }
    }, [successMessage]);

    useEffect(() => {
        socket.on('customer_message', msg => {
            setReceverMessage(msg);
            console.log(msg);
        });
    }, []);

    useEffect(() => {
        if (receverMessage) {
            console.log("Received message from customer:", receverMessage); // Logs the received message from the customer
            if (customerId === receverMessage.senderId && userInfo._id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage));
            } else {
                toast.success(`${receverMessage.senderName} sent a message`);
                dispatch(messageClear());
            }
        }
    }, [receverMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
      <div className="px-2 lg:px-7 py-5">
        <div className="w-full bg-[#f0f4f7] px-4 py-4 rounded-md h-[calc(100vh-140px)] border-2 border-gray-300">
          <div className="flex w-full h-full relative">
            <div
              className={`w-[280px] h-full absolute z-10 ${
                show ? "-left-[16px]" : "-left-[336px]"
              } md:left-0 md:relative transition-all`}
            >
              <div className="w-full h-[calc(100vh-177px)] bg-[#d9e3ea] md:bg-transparent overflow-y-auto">
                <div className="flex text-xl justify-between items-center p-4 md:p-0 md:px-3 md:pb-3 text-gray-800">
                  <h2>Customers</h2>
                  <span
                    onClick={() => setShow(!show)}
                    className="block cursor-pointer md:hidden"
                  >
                    <IoMdClose />
                  </span>
                </div>

                {customers.map((c, i) => (
                  <Link
                    key={i}
                    to={`/seller/dashboard/chat-customer/${c.fdId}`}
                    className={`h-[60px] flex justify-start gap-2 items-center text-gray-800 px-2 py-2 rounded-md cursor-pointer bg-[#bfc9d2]`}
                  >
                    <div className="relative">
                      <img
                        className="w-[38px] h-[38px] border-gray-200 border-2 max-w-[38px] p-[2px] rounded-full"
                        src="http://localhost:3001/images/admin.jpg"
                        alt=""
                      />
                      <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>
                    </div>
                    <div className="flex justify-center items-start flex-col w-full">
                      <div className="flex justify-between items-center w-full">
                        <h2 className="text-base font-semibold">{c.name}</h2>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="w-full md:w-[calc(100%-200px)] md:pl-4">
              <div className="flex justify-between items-center">
                {sellerId && customerId && currentCustomer && (
                  <div className="flex justify-start items-center gap-3">
                    <div className="relative">
                      <img
                        className="w-[45px] h-[45px] border-gray-300 border-2 max-w-[45px] p-[2px] rounded-full"
                        src="http://localhost:3001/images/demo.jpg"
                        alt=""
                      />
                      <div className="w-[10px] h-[10px] bg-green-500 rounded-full absolute right-0 bottom-0"></div>
                    </div>
                    <h2 className="text-base text-gray-800 font-semibold">
                      {currentCustomer.name}
                    </h2>
                  </div>
                )}

                <div
                  onClick={() => setShow(!show)}
                  className="w-[35px] flex md:hidden h-[35px] rounded-sm bg-[#7abec5] shadow-lg hover:shadow-[#7abec5]/50 justify-center cursor-pointer items-center text-white"
                >
                  <span>
                    <FaList />
                  </span>
                </div>
              </div>

              <div className="py-4">
                <div className="bg-[#d9e3ea] h-[calc(100vh-290px)] rounded-md p-3 overflow-y-auto">
                  {customerId ? (
                    messages.map((m, i) =>
                      m.senderId === customerId ? (
                        <div
                          key={i}
                          ref={scrollRef}
                          className="w-full flex justify-start items-center"
                        >
                          <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">
                            <div>
                              <img
                                className="w-[38px] h-[38px] border-2 border-gray-200 rounded-full max-w-[38px] p-[3px]"
                                src="http://localhost:3001/images/demo.jpg"
                                alt=""
                              />
                            </div>
                            <div className="flex justify-center items-start flex-col w-full bg-[#7abec5] shadow-lg shadow-[#7abec5]/50 text-white py-1 px-2 rounded-sm">
                              <span>{m.message}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={i}
                          ref={scrollRef}
                          className="w-full flex justify-end items-center"
                        >
                          <div className="flex justify-start items-start gap-2 md:px-3 py-2 max-w-full lg:max-w-[85%]">
                            <div className="flex justify-center items-start flex-col w-full bg-[#e67d73] shadow-lg shadow-[#e67d73]/50 text-white py-1 px-2 rounded-sm">
                              <span>{m.message}</span>
                            </div>
                            <div>
                              <img
                                className="w-[38px] h-[38px] border-2 border-gray-200 rounded-full max-w-[38px] p-[3px]"
                                src="http://localhost:3001/images/admin.jpg"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="w-full h-full flex justify-center items-center text-gray-800 gap-2 flex-col">
                      <span>Select Customer</span>
                    </div>
                  )}
                </div>
              </div>

              {customerId && (
                <form onSubmit={send} className="flex gap-3">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full flex justify-between px-2 border border-gray-400 items-center py-[5px] focus:border-[#7abec5] rounded-md outline-none bg-transparent text-gray-800"
                    type="text"
                    placeholder="Input Your Message"
                  />
                  <button className="shadow-lg bg-[#3498db] hover:shadow-[#3498db]/50 text-semibold w-[75px] h-[35px] rounded-md text-white flex justify-center items-center">
                    Send
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default SellerToCustomer;
