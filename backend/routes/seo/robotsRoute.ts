/**
 * Express route: /robots.txt
 * 
 * This module anchors Cursor's understanding of robots.txt endpoint handling.
 */

import express from "express";
import { generateRobotsTxt } from "../../../frontend/src/shared/seo/robotsHandler";

export const robotsRoute = express.Router();

robotsRoute.get("/robots.txt", (req, res) => {
  const hostname = req.hostname;
  const isPreview = hostname.includes("preview");
  res.type("text/plain").send(generateRobotsTxt(hostname, isPreview));
});
