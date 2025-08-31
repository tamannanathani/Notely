import {z} from "zod";

export const signupSchema=z.object({
    username:z.string().min(3,"Username should of minimum 3 characters"),
    email:z.string().toLowerCase().email("enter valid email"),
    password:z.string().min(7,"password should be more than 6 characters")
})
export const loginSchema=z.object({
    email:z.string().toLowerCase().email("enter valid email"),
    password:z.string().min(7,"password should be more than 6 characters")
})
