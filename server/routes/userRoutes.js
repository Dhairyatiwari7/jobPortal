import express from 'express'

const router=express.Router();

router.get('/user',getUserData);
router.post('/apply-job',applyForJob);
router.get('/job-application',getUserData);