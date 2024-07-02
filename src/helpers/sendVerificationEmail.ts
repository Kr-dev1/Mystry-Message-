import { resend } from "@/lib/resend";
import VerificationEmail from "../../emaills/verificationEmail";
import { Apiresponse } from "@/types/Apiresponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<Apiresponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystry message | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: false,
      message: "Verification email send successfully",
    };
  } catch (emailErr) {
    console.error("Error sending verification email", emailErr);
    return {
      success: false,
      message: "Failed to send verification emai",
    };
  }
}
