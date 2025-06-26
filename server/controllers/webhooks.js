import { Webhook } from 'svix';
import User from '../models/User.js';

export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = await whook.verify(
      JSON.stringify(req.body),
      {
        "svix-id": req.headers['svix-id'],
        "svix-timestamp": req.headers['svix-timestamp'],
        "svix-signature": req.headers['svix-signature'],
      }
    );

    const { data, type } = payload;

    switch (type) {
      case 'user.created': {
        const user = {
          _id: data.id,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email_addresses[0].email_address,
          resume: '',
          image: data.image_url,
        };
        await User.create(user);
        console.log('User created:', user);
        return res.status(200).json({});
      }

      case 'user.updated': {
        const user = {
          name: `${data.first_name} ${data.last_name}`,
          email: data.email_addresses[0].email_address,
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, user);
        console.log('User updated:', user);
        return res.status(200).json({});
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id);
        console.log('User deleted:', data.id);
        return res.status(200).json({});
      }

      default:
        return res.status(400).json({ success: false, message: "Unhandled event type" });
    }

  } catch (error) {
    console.error('Webhook Error:', error.message);
    return res.status(500).json({ success: false, message: "Webhook processing failed" });
  }
};
