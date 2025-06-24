import z, { date } from 'zod';

const userSchema = z.object({
    name: z.string().min(1, "Name is required").trim(),
    email: z.string().email("Invalid email address").min(1, "Email is required").trim(),
    password: z.string().min(8, "Password must be at least 8 characters long").max(20, "Password must be at most 20 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,20}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character").trim(),
    pic: z.string().optional(),
});

const groupChatSchema = z.object({
    isGroupChat: z.literal(true),
    chatName: z.string().trim(),
    latestMessage: z.string().trim().optional(),
    groupPic: z.string().optional(),
    users: z.array(z.string()).min(1, "At least one user is required")
}).refine((data) => {
    if (data.isGroupChat && !data.chatName) {
        return false;
    }
    return true;
}, {
    message: "Chat name is required for group chats",
});

const messageSchema = z.object({
    content: z.string().min(1, "Message content is required").trim(),
    senderId: z.string(),
    chatId: z.string(),
}).refine((data) => {   
    if (data.content.length > 500) {
        return false;
    }
    return true;
}, {
    message: "Message content exceeds maximum length of 500 characters",
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty("email is empty")
    .email("email required"),
  password: z.string().min(1, "Password is required").trim(),
}).refine((data)=>{
    if (!data.email) {
        return false;
    }
    return true;
}, {
    message: "Email is required",
});

export { userSchema, groupChatSchema, messageSchema, loginSchema };