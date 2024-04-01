import { NextApiRequest, NextApiResponse } from "next";
import { MoonPayAuthSDK } from '@moonpay/auth-sdk';
import { MoonpayWalletSDK } from "@moonpay/login-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if(!process.env.NEXT_PUBLIC_MOONPAY_API_KEY) {
    throw new Error('NEXT_PUBLIC_MOONPAY_API_KEY is not set');
  }


    try {
      const sdk = new MoonpayWalletSDK({
        loginDomain: "https://buy-sandbox.moonpay.com",
        secureWalletDomain: "https://web3.moonpay.com",
        apiKey: process.env.NEXT_PUBLIC_MOONPAY_API_KEY,
      });
      
      console.log(sdk, 'sdk')
      
      res.status(200).json(sdk);
    } catch (error) {
      console.error('Ошибка при перенаправлении запроса к Moonpay:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
}
