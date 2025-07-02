import express from 'express';
import {
    registerComapany,
    loginCompany,
    getCompanyData,
    postJob,
    getCompanyJobApplicants,
    getCompanyPostedJobs,
    changeJobStatus,
    changeVisibility
} from '../controllers/companyController.js';
import upload from '../config/multer.js'
import {protectCompany} from '../middlewares/authmiddleware.js';

const router = express.Router();

router.post('/register',upload.single('image'), registerComapany);
router.post('/login', loginCompany); 
router.get('/company',protectCompany, getCompanyData);
router.post('/post-job',protectCompany, postJob);
router.get('/applicants',protectCompany, getCompanyJobApplicants);
router.get('/list-jobs',protectCompany, getCompanyPostedJobs);
router.post('/change-visibility',protectCompany, changeVisibility);
router.post('/change-status',protectCompany, changeJobStatus);

export default router;