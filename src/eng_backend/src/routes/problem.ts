import { Router } from "express";
import WordController from './../controllers/word-controller';
import SentenceController from './../controllers/sentence-controller';
const router = Router();

router.post("/get-word-list", WordController.getWordList);
router.post("/get-sentence-list", SentenceController.getSentenceList);
router.post("/get-sentence-view-list", SentenceController.getSentenceViewList);

export default router;