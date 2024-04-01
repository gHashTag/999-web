import { Web3Provider } from "@ethersproject/providers";

import { useEffect, useState } from "react";

// // @ts-ignore
// import { MoonpayWalletSDK } from "@moonpay/login-sdk";

// const sdk = new MoonpayWalletSDK({
//   loginDomain: "/login", // Используйте ваш прокси-маршрут
//   secureWalletDomain: "/secure", // Используйте ваш прокси-маршрут
//   apiKey: process.env.NEXT_PUBLIC_MOONPAY_API_KEY, // Используйте публичный ключ, если он нужен
// });

function App() {
  const [provider, setProvider] = useState<Web3Provider>();
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [unsignedMessage, setUnsignedMessage] = useState<string>("");
  const [signedMessage, setSignedMessage] = useState<string>("");

  useEffect(
    () => {
      if (provider) {
        getAllWalletInfo();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [provider]
  );

  const getAllWalletInfo = async () => {
    if (!provider) return;
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    setAddress(address);
    setBalance(balance.toString());
  };

  const signMessage = async () => {
    if (!provider) return;
    const signer = provider.getSigner();
    const signature = await signer.signMessage(unsignedMessage);
    setSignedMessage(signature);
  };

  return (
    <div className="App w-1/2 mx-auto mt-10 text-gray-700">
      {/* header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold p-4">Moonpay Wallet SDK</h1>
        <p className="text-gray-500">
          This is a demo of the Moonpay Wallet SDK. You can use this SDK to
          integrate Moonpay's secure wallet into your dApp.
        </p>
      </div>

      {/* wallet info */}
      <div className="p-4">
        <h2 className="text-2xl font-bold p-4">Wallet Info</h2>
        <p className="text-gray-500 text-left">
          <span className="font-bold">Address:</span> {address}
        </p>
        <p className="text-gray-500 text-left">
          <span className="font-bold">Balance:</span> {balance}
        </p>
      </div>

      {/* sign message */}
      <div className="p-4">
        <h2 className="text-2xl font-bold p-4">Sign a message</h2>
        <textarea
          className="p-4 border-2 border-gray-300 rounded-md bg-gray-100 w-full h-40 mt-4"
          value={unsignedMessage}
          onChange={(e) => setUnsignedMessage(e.target.value)}
        />
        <button
          className="m-4 p-3 border-2 border-gray-300 w-[200px] bg-[#7D00FF] font-bold text-white hover:bg-[#5A00D1] outline-none rounded-full outline-0"
          onClick={signMessage}
        >
          Sign Message
        </button>
        <p className="text-gray-500">
          <span className="font-bold">Signed Message:</span>
        </p>
        <textarea
          disabled
          className="p-4 border-2 border-gray-300 rounded-md bg-gray-100 w-full h-40 mt-4"
          value={signedMessage}
        />
      </div>
    </div>
  );
}

export default App;
