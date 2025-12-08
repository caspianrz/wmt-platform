import { Request, Response, Router } from "express";
import { existsSync, readFileSync } from "fs";
import { strategyData } from "~/strategies/GetStrategy";

const router: Router = Router();

/**
 * This function returns list of all strategies available.
 */
router.get("/", async (_req: Request, res: Response) => {
  const strategies = strategyData;
  return res.status(200).json(Object.keys(strategies));
});

router.get("/:strategy", async (req: Request, res: Response) => {
  const strategy = req.params["strategy"];
  if (strategy == undefined) {
    return res.status(401).json({ message: "No strategy specified." });
  }

  if (!strategyData[strategy]) {
    return res.status(404).json({ message: "Strategy not found." });
  }

  return res.status(200).json(strategyData[strategy]);
});

export default router;
