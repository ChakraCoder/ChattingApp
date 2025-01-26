import { Router } from "express";
import { validateBody } from "../middlewares/validationMiddleware";
import { searchContactsController } from "../controllers/contactsController";
import { searchContactSchema } from "../schemas/contactSchema";
import { authenticate } from "../middlewares/authMiddleware";

const contactRouter = Router();

contactRouter.post(
  "/search",
  authenticate,
  validateBody(searchContactSchema),
  searchContactsController,
);

export default contactRouter;
