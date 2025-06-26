import {Webhook} from 'svix'
import User from '../models/User.js'

export const clerkWebhooks = async(req,res)=>{
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers['svix-id'],
            "svix-timestamp": req.headers['svix-timestamp'],
            "svix-signature": req.headers['svix-signature']
        })

        const {data,type}=req.body;

        switch (key) {
            case 'user.created':{
                const user={
                    _id : data.id,
                    name : data.first_name + " "+data.last_name,
                    email : data.email_addresses[0].email_address,
                    resume : '',
                    image : data.image_url
                }
                await User.create(user);
                res.json({});
                break;
            }
            case 'user.updated':{
                const user={
                    name : data.first_name + " "+data.last_name,
                    email : data.email_addresses[0].email_address,
                    image : data.image_url
                }
                await User.findByIdAndUpdate(data.id,user);
                res.json({});
                break;
            }
            case 'user.deleted':{
                await User.findByIdAndDelete(data.id); 
                res.json({});
                break;
            }
            default:
                break;
        }
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message: "Webhooks Error"}); 
    }
}