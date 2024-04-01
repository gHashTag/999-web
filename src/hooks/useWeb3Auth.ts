"use client";

import { useEffect, useState } from "react";
import { IProvider } from "@web3auth/base";
import { web3auth } from "@/utils/web3Auth";
import Web3 from "web3";

// Corrected the import path for useRouter
import { useRouter } from "next/router";
import { ExtendedOpenloginUserInfo } from "@/types";
import { useSupabase } from "./useSupabase";
import { useQuery, useReactiveVar } from "@apollo/client";
import {
  setAddress,
  setBalance,
  setInviteCode,
  setLoggedIn,
  setUserEmail,
  setUserInfo,
  visibleHeaderVar,
  visibleSignInVar,
} from "@/apollo/reactive-store";
import { MoonpayWalletSDK } from "@moonpay/login-sdk";
import { Web3Provider } from "@ethersproject/providers";
import { MoonPayAuthSDK } from "@moonpay/auth-sdk";
// import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'


const useWeb3Auth = () => {
  if (!process.env.NEXT_PUBLIC_MOONPAY_API_KEY) {
    throw new Error("NEXT_PUBLIC_MOONPAY_API_KEY is not set");
  }
  const sdk = new MoonPayAuthSDK(process.env.NEXT_PUBLIC_MOONPAY_API_KEY);
  const router = useRouter();
  const loggedIn = useReactiveVar(setLoggedIn);
  const address = useReactiveVar(setAddress);
  const balance = useReactiveVar(setBalance);

  const [provider, setProvider] = useState<Web3Provider>();
  const [unsignedMessage, setUnsignedMessage] = useState<string>("");
  const [signedMessage, setSignedMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { createSupabaseUser, getSupabaseUser } = useSupabase();

  const handleLogin = async () => {
    const loginResult = await sdk.login.show();
    const { customer } = loginResult.partner // Partner token
    console.log(`Hello ${customer.email}`)
    if (loginResult !== null) {
      if (loginResult.success) {
        setIsLoggedIn(true);
      }
    }
  }

    // Handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    sdk.logout();
  }
  
  useEffect(() => {
    const loadSdk = async () => {
      await sdk.init();
      const isLoggedIn = await sdk.isLoggedIn()
      setIsLoggedIn(isLoggedIn)
      
    }
  
    loadSdk();
  }, [isLoggedIn])

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

  useEffect(() => {
    const email = localStorage.getItem("email");
    // console.log(email, "email");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const login = async () => {
    console.log("login");
    try {
      // const web3authProvider = await web3auth.connect();
      // setProvider(web3authProvider);

      // if (web3auth.connected) {
        // setLoggedIn(true);
      // const userInfo = await web3auth.getUserInfo();
      
        // console.log("userInfo", userInfo);
        // if (userInfo) {
        //   setUserInfo({ ...userInfo } as ExtendedOpenloginUserInfo);
        //   await createSupabaseUser();

        //   if (userInfo.email) {
        //     console.log("set user info");
        //     localStorage.setItem("email", userInfo.email);
        //     const supabaseUser = await getSupabaseUser(userInfo.email);
        //     localStorage.setItem("user_id", supabaseUser.user_id);
        //     localStorage.setItem("first_name", supabaseUser.first_name);
        //     localStorage.setItem("last_name", supabaseUser.last_name);
        //   }
        // }
        // visibleHeaderVar(true);

        // return true;
      // }
    } catch (error) {
      if (error instanceof Error && error.message === "User closed the modal") {
        // Обработка ситуации, когда всплывающее окно было закрыто пользователем
        console.log("Вход отменен пользователем");
        router.push("/");
      } else {
        // Обработка других видов ошибок
        console.error("Ошибка входа:", error);
      }
      return false;
    }
  };

  const logout = async () => {
    console.log("logout");
    try {
      // IMP START - Logout
      visibleSignInVar(false);
      visibleHeaderVar(false);
      // IMP END - Logout
      setLoggedIn(false);
      setProvider(undefined);
      setAddress("");
      setUserInfo(null);
      setBalance(null);
      setInviteCode("");
      router.push("/");
      await web3auth.logout();
      localStorage.removeItem("email");
      localStorage.removeItem("user_id");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
      // apolloClient.clearStore().then(() => {
      //   apolloClient.resetStore();
      //   router.push("/");
      // });
    } catch (error) {
      // console.error("Ошибка при разлогинивании:", error);
    }
  };


  return {
    handleLogin,
    handleLogout,
    address,
    balance,
    provider,
    loggedIn,
    login,
    logout,
    setProvider,
    setLoggedIn,
    signMessage,
  };
};

export { useWeb3Auth };
