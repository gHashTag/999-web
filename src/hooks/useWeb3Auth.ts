"use client";

import { useEffect, useState } from "react";
import { IProvider } from "@web3auth/base";
import { web3auth } from "@/utils/web3Auth";
import Web3 from "web3";

// Corrected the import path for useRouter
import { useRouter } from "next/router";
import { SupabaseUser } from "@/types";
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

// import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'

const useWeb3Auth = () => {
  const router = useRouter();
  const loggedIn = useReactiveVar(setLoggedIn);
  const address = useReactiveVar(setAddress);
  const balance = useReactiveVar(setBalance);

  const [provider, setProvider] = useState<IProvider | null>(null);

  const { createSupabaseUser, getSupabaseUser } = useSupabase();

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
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);

      if (web3auth.connected) {
        setLoggedIn(true);
        const userInfo = await web3auth.getUserInfo();
        console.log("userInfo", userInfo);
        if (userInfo) {
          setUserInfo({ ...userInfo } as SupabaseUser);
          await createSupabaseUser();

          if (userInfo.email) {
            console.log("set user info");
            localStorage.setItem("email", userInfo.email);
            const supabaseUser = await getSupabaseUser(userInfo.email);
            localStorage.setItem("user_id", supabaseUser.user_id);
            localStorage.setItem("first_name", supabaseUser.first_name);
            localStorage.setItem("last_name", supabaseUser.last_name);
          }
        }
        visibleHeaderVar(true);

        return true;
      }
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
      setProvider(null);
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

  const getAccounts = async () => {
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (!provider) {
      // console.log("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const accounts = await web3.eth.getAccounts();
    setAddress(accounts[0]);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const bal = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );

    setBalance(bal);
  };

  const signMessage = async () => {
    if (!provider) {
      // console.log("provider not initialized yet");
      return;
    }
    const web3 = new Web3(provider as any);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
  };

  return {
    address,
    balance,
    provider,
    loggedIn,
    login,
    logout,
    setProvider,
    setLoggedIn,
    signMessage,
    getBalance,
    getAccounts,
  };
};

export { useWeb3Auth };
