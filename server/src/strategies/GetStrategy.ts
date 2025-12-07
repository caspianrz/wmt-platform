import axios from "axios";
import { stat } from "fs";

export let strategyDataWtsvd: Object;
export let strategyDataSharifWM: Object;

const strategyList = {
  "DWT HD SVD": "http://0.0.0.0:10001/strategy",
  "Sharif WM": "http://0.0.0.0:10002/strategy",
};

const fetchStrategyDatadWtsvd = async () => {
  try {
    const response = await axios.get("http://0.0.0.0:10001/strategy");
    strategyDataWtsvd = response.data;
    console.log("Strategy data WTSVD fetched and stored!");
  } catch (error) {
    console.error("Failed to fetch strategy data:", error);
  }
};

const fetchStrategyDatadSharifWM = async () => {
  try {
    const response = await axios.get("http://0.0.0.0:10002/strategy");
    strategyDataSharifWM = response.data;
    console.log("Strategy data SharifWM fetched and stored!");
  } catch (error) {
    throw error;
  }
};

export const fetchStrategyData = () => {
  try {
    fetchStrategyDatadWtsvd();
    fetchStrategyDatadSharifWM();
  } catch (error) {
    console.error("Failed to fetch strategy data:", error);
  }
};
