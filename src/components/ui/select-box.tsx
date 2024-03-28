"use client";
import React from "react";
import { OptionType, RoomNode, RoomsData } from "@/types";
import AsyncSelect from "react-select/async";
import { StylesConfig, ActionMeta, SingleValue } from "react-select";
import {
  ColourOption,
  colourOptions,
} from "../../pages/[workspaceSlug]/create-meet/data";
import {
  setAssetInfo,
  setRoomId,
  setSelectedRoomName,
} from "@/apollo/reactive-store";

const filterColors = (inputValue: string) => {
  return colourOptions.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const promiseOptions = (inputValue: string) =>
  new Promise<ColourOption[]>((resolve) => {
    console.log(inputValue, "inputValue");
    setTimeout(() => {
      resolve(filterColors(inputValue));
    }, 1000);
  });

const customStyles: StylesConfig<OptionType, false> = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#f6ff00" : "rgba(12, 10, 9, 0.8)",
    color: state.isFocused ? "black" : provided.color,
    ":hover": {
      ...provided[":hover"],
      backgroundColor: "#f6ff00",
      color: "black",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "rgba(12, 10, 9, 0.8)",

    zIndex: 1000,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,

    borderColor: "gray",
    backgroundColor: "rgba(12, 10, 9, 0.8)",
  }),
  control: (baseStyles) => ({
    ...baseStyles,
    marginTop: 11,
    minWidth: 300,
    borderColor: "gray",
    boxShadow: "#f6ff00",
    "&:hover": { borderColor: "#f6ff00" },
    backgroundColor: "rgba(12, 10, 9, 0.8)",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#f6ff00", // Цвет текста главного элемента
  }),
};

interface ComboboxProps {
  roomsData: RoomsData;
  assetInfo: OptionType | null;
}
export function SelectBox({ roomsData, assetInfo }: ComboboxProps) {
  const options: OptionType[] = roomsData.roomsCollection.edges.map(
    ({ node }: { node: RoomNode }) => ({
      value: node.room_id,
      label: node.name,
      color: "black",
    })
  );

  const handleChange = (
    newValue: SingleValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    if (newValue) {
      setSelectedRoomName(newValue.label);
      // localStorage.setItem("name", newValue.label);
      setRoomId(newValue.value);
      // localStorage.setItem("room_id", newValue.value);
      setAssetInfo({
        value: newValue.value,
        label: newValue.label,
      });
    }
  };

  return (
    <AsyncSelect
      defaultValue={options[0]}
      cacheOptions
      value={assetInfo}
      defaultOptions={options}
      options={options}
      styles={customStyles}
      onChange={handleChange}
      //isMulti
      loadOptions={promiseOptions}
    />
  );
}
