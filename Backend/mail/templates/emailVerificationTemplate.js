exports.emailVerificationTemplate = (otp)=>{
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        .container{
            font-family: cursive;
            background-color: grey;
            color: white;
            text-align:center;
            font-size:large;
        }
    
        .hero{
            background-color: rgb(202, 202, 86);
            text-align: center;
            color:white;
            padding-bottom:15px;
            margin-bottom:10px
        }
        .heading{
            padding-top:15px;
            padding-bottom:10px;
            font-size: x-large;
            font-weight: bold;
        }
        p{
            color:black;
            margin:0;
        }
        .hero p {
            color:white;
        }
        .OTP{
            font-size: xx-large;
            font-weight: bolder;
        }
        .footer{
            padding-bottom:15px;
        }
    </style>
</head>
<body>
        <div class="container">
        <div class="hero">
            <p class="heading">|| Greetings from Parikshit ||</p>
            <p>Thanks for your support for the great revolution in tech field.</p>
        </div>
        <div class="mid">
            <p >Here is your OTP for registeration</p>
            <p class="OTP">${otp}</p>
            <p >Enter the OTP and be a part of the revolution.</p>
        </div>
        <div class="footer">
            <p>This OTP is valid for 5 minutes. If you did not request this verification, please ignore this E-mail.</p>
        </div>
        </div>
</body>
</html>`
}