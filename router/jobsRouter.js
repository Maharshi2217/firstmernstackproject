import express from 'express'
const router=express.Router()
import authenticateUser from '../middleware/auth.js'


import {createJobs,deleteJob,getAllJobs,updateJob,showStats } from '../controllers/jobsControllers.js'

router.route('/createJob').post(createJobs).get(getAllJobs)

router.route('/stats').get(showStats)
router.route('/:id').delete(deleteJob).patch(updateJob)

export default router