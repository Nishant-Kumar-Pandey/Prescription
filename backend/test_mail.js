import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const testMail = async () => {
    console.log("Testing with User:", process.env.EMAIL_USER);
    const password = process.env.PASSWORD;
    console.log("Testing with Password:", password ? `[${password}]` : "MISSING");

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: password,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "Test Email from RxExplain (v2)",
        text: "This is a test email to verify Nodemailer configuration with explicit SMTP settings.",
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("SUCCESS: Email sent!", info.response);
    } catch (error) {
        console.error("FAILURE: Error sending email:");
        console.error(error);
    }
};

testMail();
