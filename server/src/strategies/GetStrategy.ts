import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const strategyList = JSON.parse(process.env.STRATEGY_LIST!);

export const strategyData: Record<string, unknown> = {};

const cleanStrategyData = (obj: Record<string, unknown>) => {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].replace("image;base64", "image name");
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      cleanStrategyData(obj[key] as Record<string, unknown>);
    }
  }
  return obj;
};

export const fetchStrategyData = async () => {
  try {
    const entries = Object.entries(strategyList);
    const results = await Promise.all(
      entries.map(async ([key, url]) => {
        const response = await axios.get(url as string);
        return [key, response.data] as [string, unknown];
      })
    );

    results.forEach(([key, data]) => {
      strategyData[key] = data;
    });

    cleanStrategyData(strategyData);

    console.log("Strategy data fetched and stored!");
  } catch (error) {
    console.error("Failed to fetch strategy data:", error);
  }
};
