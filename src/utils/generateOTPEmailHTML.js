const generateOTPEmailHTML = (otp, subtitle, name ) => {
    return `
    <!DOCTYPE>

    <head>
      <meta http-equiv="Content-Type" charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your login</title>
    </head>
    
    <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
      <table role="presentation"
        style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
        <tbody>
          <tr>
            <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
              <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                <tbody>
                  <tr>
                    <td style="padding: 40px 0px 0px;">
                      <div style="text-align: left;">
                        <div style="padding-bottom: 20px;"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png" alt="Company" style="height: 30px;"></div>
                      </div>
                      <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                        <div style="color: rgb(0, 0, 0); text-align: left;">
                          <h1 style="margin: 1rem 0; color: #1f1f1f;">Verification code</h1>
                          <p style="padding-bottom: 16px; color: #1f1f1f !important;">${subtitle}</p>
                          <p style="padding-bottom: 26px; padding-top:10px; text-align: center;"> <strong style="font-size: 130%; padding: 10px 25px; background: #ff0000; color: #f2f2f2; letter-spacing: 2px;" >${otp}</strong> </p> 
                          <p style="padding-bottom: 16px;color: #1f1f1f;">If you didn’t request this, you can ignore this email.</p> 
                          <p style="padding-bottom: 16px;color: #1f1f1f;">Thanks,<br>${name}</p>
                        </div>
                      </div>
                      <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                        <p style="padding-bottom: 16px">AirBnb Team</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
    
    </html>
    `;
  };
  
  module.exports = generateOTPEmailHTML;
  