TEMPLATE = {};

TEMPLATE.verification = '<!DOCTYPE html>' + ' <html lang="en">' + '<head>' + '<meta charset="UTF-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1.0">' + '</head>' +
  "<style> @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap'); </style>" +
  ' <body style="background-color: #eff6ff; padding: 20px; font-family: "Poppins", sans-serif; display: flex; align-items: center; justify-content: center;">' +
  '<div style="background-color: white; ">' +
  '<div style="padding: 15px; background-color:#818cf8; color: white; text-align: center; letter-spacing: 2px;">' +
  '<h2>Expense Expert</h2>' + '</div>' +
  '<div style="padding: 25px; text-align: center;border: 1px solid rgb(223, 217, 217);">' + '<h2 style="font-weight: 400;">Email Conformation</h2>' +
  '<p style="font-size: 14px; color: #7A898D; line-height: 2">Hello, {{name}} you are almost ready to use <br>our application, simply click confirm button to verify your email address</p>' +
  '<a href="http://expense-expert.web.app/validate-user/{{userId}}" target="_blank" style="font-size: 13px; text-decoration: none; padding: 10px 30px; border-radius: 8px; border: none; background-color: #818cf8; margin-top: 10px; color: white;">Verify</a>' +
  '<p style="font-size: 13px; margin-top: 20px; color: #7A898D;">Any help ? contact <a href="" style="color: black; cursor: pointer;"> Bharath</a></p>' +
  '</div>' + '</div>' + '</body>' + ' </html>'