// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { record, old_record } = await req.json()

  // 1. Only trigger if is_approved changed from false to true
  if (record.is_approved === true && old_record.is_approved === false) {
    
    // 2. Fetch the user's email from the Auth schema (since it's not in the public table)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: userData } = await supabase.auth.admin.getUserById(record.id)
    const userEmail = userData.user?.email

    if (!userEmail) return new Response("No email found", { status: 400 })

    const isNewUser = record.needs_password_change === true;
    
    const emailHtml = isNewUser ? `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
            <h2 style="color: #064e3b;">Welcome to the ADOFOM Portal, ${record.full_name}</h2>
            <p>Your account has been officially verified and approved by the Super Admin.</p>
            <div style="background-color: #f8fafc; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0;">
                <p style="margin-top: 0;"><strong>Your Temporary Password:</strong></p>
                <p style="font-size: 18px; font-family: monospace; background: #e2e8f0; padding: 8px; display: inline-block; border-radius: 4px; margin-bottom: 0;">ADOFOM@2026!</p>
            </div>
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Log in using your email and the temporary password above.</li>
              <li>You will be required to change your password immediately upon first login.</li>
              <li>Complete your professional profile.</li>
            </ul>
            <a href="https://your-portal-url.com" style="background-color: #f59e0b; color: black; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-top: 10px;">Sign In to Portal</a>
            <p style="font-size: 12px; color: #64748b; margin-top: 30px;">This is an automated message from the Ondo State Administrative Officers Forum.</p>
          </div>
        ` : `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
            <h2 style="color: #064e3b;">Access Restored, ${record.full_name}</h2>
            <p>Your existing ADOFOM Portal account has been re-verified and approved by the Super Admin.</p>
            <p>You can now log in using your standard password to access the closed-door directory and your profile.</p>
            <a href="https://your-portal-url.com" style="background-color: #f59e0b; color: black; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-top: 10px;">Sign In to Portal</a>
            <p style="font-size: 12px; color: #64748b; margin-top: 30px;">This is an automated message from the Ondo State Administrative Officers Forum.</p>
          </div>
        `;

    // 3. Send the Email via Resend
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ADOFOM Portal <onboarding@yourdomain.com>',
        to: [userEmail],
        subject: isNewUser ? 'Welcome to ADOFOM Official Portal' : 'Access Restored: ADOFOM Official Portal',
        html: emailHtml,
      }),
    })

    return new Response(JSON.stringify({ sent: true }), { status: 200 })
  }

  return new Response(JSON.stringify({ sent: false }), { status: 200 })
})
