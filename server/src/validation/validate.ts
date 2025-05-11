import z from 'zod';

const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    phone: z.string().min(1, "Phone number is required"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(20, "Password must be at most 20 characters long").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

const chatSchema = z.object({
    type: z.enum(["PRIVATE", "GROUP"]),
    title: z.string().optional(),
}).refine((data) => {
    if (data.type === "GROUP" && !data.title) {
        return false;
    }
    return true;
}, {
    message: "Title is required for group chats",
});


const participantSchema = z.object({
    userId: z.string().uuid("Invalid user ID"),
    chatId: z.string().uuid("Invalid chat ID"),
    role: z.enum(["MEMBER", "ADMIN", "OWNER"]).optional(),
});

const messageSchema = z.object({
    content: z.string().min(1, "Message content is required"),
    senderId: z.string().uuid("Invalid sender ID"),
    chatId: z.string().uuid("Invalid chat ID"),
}).refine((data) => {   
    if (data.content.length > 500) {
        return false;
    }
    return true;
}, {
    message: "Message content exceeds maximum length of 500 characters",
});

export { userSchema, chatSchema, participantSchema, messageSchema };