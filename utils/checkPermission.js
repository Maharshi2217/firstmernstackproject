import CustomAPIError from '../errors/custom-api.js'
import {UnAuthenticatedError} from '../errors/index.js'
const checkPermissions =(requestUser,resourceUserId)=>{
    if(requestUser.role==='admin')return 
    if(requestUser.userId===resourceUserId.toString()) return//everytime same userid generated for user ?
    throw new UnAuthenticatedError('Not Autjorized to access')
}

export default checkPermissions