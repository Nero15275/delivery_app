import express, { Application } from "express";
import bodyParser from "body-parser";
import { AdminRoute, VendorRoute } from "../routes";
import path from "path";

export default async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
  app.use("/admin", AdminRoute);
  app.use("/vendor", VendorRoute);

  return app;
};
