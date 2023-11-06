TEMPLATE = {};

TEMPLATE.verification = '<!DOCTYPE html>' + ' <html lang="en">' + '<head>' + '<meta charset="UTF-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">' + '</head>' +
  "<style> @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap'); </style>" +
  ' <body style="background-color: #eff6ff; padding: 20px; font-family: "Poppins", sans-serif; display: flex; align-items: center; justify-content: center;">' +
  '<div style="background-color: white; ">' +
  '<div style="padding: 15px; background-color:#818cf8; color: white; text-align: center; letter-spacing: 2px;">' +
  '<h2>Expense Expert</h2>' + '</div>' +
  '<div style="padding: 25px; text-align: center;border: 1px solid rgb(223, 217, 217);">' + '<h2 style="font-weight: 400;">Email Conformation</h2>' +
  '<p style="font-size: 14px; color: #7A898D; line-height: 2">Hello, {{name}} you are almost ready to use <br>our application, simply click conform button to verify your email address</p>' +
  '<a href="https://expense-expert.me/validate-user/{{userId}}" target="_blank" rel="noopener" style="font-size: 13px; text-decoration: none; padding: 10px 30px; border-radius: 8px; border: none; background-color: #818cf8; margin-top: 10px; color: white;">Verify</a>' +
  '<p style="font-size: 13px; margin-top: 20px; color: #7A898D;">Any help ? contact <a href="" style="color: black; cursor: pointer;"> Bharath</a></p>' +
  '</div>' + '</div>' + '</body>' + ' </html>'

TEMPLATE.resetPasword = '<!DOCTYPE html>' +
  '<html lang="en">' +
  '<head>' +
  '<meta charset="UTF-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
  '<title>resetPassword</title>' +
  '</head>' +
  '<style>' +
  "@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');" +
  '</style>' +
  '<body style="font-family: "Poppins", sans-serif; padding: 0;margin: 0;">' +
  '<div style="text-align: center;padding: 10px 0;background-color: #2c3e50; color: white;">' +
  '<h2 style="margin: 10px;">Expense Expert</h2>' +
  '<h3 style="margin: 10px;">Reset Password</h3>' +
  '</div>' +
  '<div style="font-size: 16px;padding: 30px 20px;">' +
  '<p>Hi {{name}}.</p>' +
  '<div >' +
  '<span>We received the request to reset the password for your account.</span>' +
  '</div>' +
  '<p>To reset your password, click on the below button.</p>' +
  '<a target="_blank" rel="noopener" href="https://localhost:4200/change-password/{{userId}}" style="margin-top: 10px; padding: 7px 14px; background-color: #2c3e50; color: white; border: none; border-radius: 5px; font-size: 14px; text-decoration: none; display: inline-block;">Reset password </a>' +
  '</div>' +
  '</body>' +
  '</html>'

TEMPLATE.verification_V1 = '<html>' +
  '<head>' +
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
  "<style> @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap'); </style>" +
  '</head>' +
  '<body style="padding: 0;margin: 0;font-family: "Roboto", sans-serif; background-color: #ede9fe; padding: 10px;">' +
  '<div style="background-color: white;">' +
  '<div style="padding: 22px; background-color: #030712;">' +
  '<h3 style="margin: 0; color: white; font-size: 22px;">Expense Expert</h3>' + '</div>' +
  '<div style="padding: 38px 22px; border-bottom: 1px solid #030712;border-bottom-style: dashed;">' +
  '<h3 style="margin: 0 0 14px 0; color: #030712;">Hi, {{name}}</h3>' +
  '<p style="margin:3px 0; font-size: 14px;">Thankyou for signing up, we just need to verify your email address.</p> ' +
  '<div style="margin: 30px 0;">' +
  '<a href="https://expense-expert.me/validate-user/{{userId}}" style="font-size: 13px;padding: 10px 22px; background-color: #030712; color: white; text-decoration: none;">Verify Email</a>' +
  '</div> <div style="font-size: 12px;">You can also verify the email by copying and pasting the following link into your browser.</div>' +
  '<div style="margin-top: 5px; font-size: 12px; color: #6b7280;">https://expense-expert.me/validate-user/{{userId}}"</div> </div>' +
  '<div style="padding: 22px 0">' +
  '<h3 style="color: #030712; text-align: start;font-size: 15px;margin: 0px 22px 4px;">With Regards </h3>' +
  '<span style="margin: 0px 0px 0 22px;font-size: 11px;">Bharath Prakash</span>' +
  '<br> </div> </div>' +
  '<div style="padding: 15px;text-align: center;font-size: 12px;">' +
  '<span> If you have any issues confirming your email we will be happy to help you. You can contact us on </span>' +
  '<a style="font-weight: bold; cursor: pointer; text-decoration: none; color: #030712;" href="mailto:bharathprakash2395@gmail.com">bharathprakash2395@gmail.com</a>' +
  '</div>' +
  '</body>' +
  '</html>'