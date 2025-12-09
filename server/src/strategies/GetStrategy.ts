import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const strategyList = JSON.parse(process.env.STRATEGY_OBJ!);

export const strategyData: Record<string, any> = {};

const cleanStrategyData = (obj: Record<string, unknown>) => {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key]
        .replace("image;base64", "image name")
        .replace("string;int64", "string (int64)");
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      cleanStrategyData(obj[key] as Record<string, unknown>);
    }
  }
};

export const fetchStrategyData = async () => {
  try {
    const entries = Object.entries(strategyList);
    const results = await Promise.all(
      entries.map(async ([key, url]) => {
        const response = await axios.get(`${url}/strategy` as string);

        const urlObj = { url: url as string };

        return [key, urlObj, response.data] as [string, { url: string }, any];
      })
    );

    results.forEach(([key, urlObj, responseData]) => {
      strategyData[key] = {
        ...urlObj,
        ...responseData,
      };
    });

    cleanStrategyData(strategyData);

    type StrategyDataType = typeof strategyData;

    console.log("Strategy data fetched and stored!");
  } catch (error) {
    console.error("Failed to fetch strategy data:", error);
  }
};
