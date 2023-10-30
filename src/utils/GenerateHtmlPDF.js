module.exports = (data) => {
  // current date calculate
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // January is 0
  const year = currentDate.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  // address formatting
  const formattedAddress = `${data?.metadata?.addressLine1}, ${data?.metadata?.city}, ${data?.metadata?.country} - ${data?.metadata?.postalCode}`;

  // check in time and date calculate
  const checkInDate = new Date(data.metadata.startDate);
  const checkOutDate = new Date(data.metadata.endDate);

  const checkInYear = checkInDate.getFullYear();
  const checkInMonth = checkInDate.getMonth() + 1; // Months are 0 indexed, so you need to add 1
  const checkInDay = checkInDate.getDate();
  const checkInHours = checkInDate.getHours();
  const checkInMinutes = checkInDate.getMinutes();
  const checkInSeconds = checkInDate.getSeconds();

  const checkOutYear = checkOutDate.getFullYear();
  const checkOutMonth = checkOutDate.getMonth() + 1; // Months are 0 indexed, so you need to add 1
  const checkOutDay = checkOutDate.getDate();
  const checkOutHours = checkOutDate.getHours();
  const checkOutMinutes = checkOutDate.getMinutes();
  const checkOutSeconds = checkOutDate.getSeconds();

  const checkInOnlyDate = `${checkInYear}-${
    checkInMonth < 10 ? "0" + checkInMonth : checkInMonth
  }-${checkInDay < 10 ? "0" + checkInDay : checkInDay}`;
  //   const checkInOnlyTime = `${
  //     checkInHours < 10 ? "0" + checkInHours : checkInHours
  //   }:${checkInMinutes < 10 ? "0" + checkInMinutes : checkInMinutes}:${
  //     checkInSeconds < 10 ? "0" + checkInSeconds : checkInSeconds
  //   }`;

  const checkOutOnlyDate = `${checkOutYear}-${
    checkOutMonth < 10 ? "0" + checkOutMonth : checkOutMonth
  }-${checkOutDay < 10 ? "0" + checkOutDay : checkOutDay}`;
  //   const checkOutOnlyTime = `${
  //     checkOutHours < 10 ? "0" + checkOutHours : checkOutHours
  //   }:${checkOutMinutes < 10 ? "0" + checkOutMinutes : checkOutMinutes}:${
  //     checkOutSeconds < 10 ? "0" + checkOutSeconds : checkOutSeconds
  //   }`;

  return `
      <!doctype html>
<html>
   <head>
       <meta charset="utf-8">
       <title>PDF Result Template</title>
       <style>
           .invoice-box {
              border: 1px solid #f5f5f5;
               max-width: 800px;
               margin: auto; 
               padding: 30px;
               font-size: 16px;
               line-height: 24px;
               font-family: "Helvetica Neue", "Helvetica", sans-serif;
               color: #555;
           }
           .fs14 {
               font-size: 14px;
           }
           .totalPrice {
               padding-top: 20px;
               font-size: 16px;
               font-weight: 600;
           }
           .margin-top {
               margin-top: 50px;
           }
           .justify-center {
               text-align: center;
           }
           .invoice-box table {
               width: 100%;
               line-height: inherit;
               text-align: left;
           }
           .invoice-box table td {
               padding: 5px;
               vertical-align: top;
           }
           .invoice-box table tr td:nth-child(2) {
               text-align: right !important;
           }
           .text-right{
            text-align: right;
           }
           .invoice-box table tr.top table td {
               padding-bottom: 20px;
           }
           .invoice-box table tr.top table td.title {
               font-size: 45px;
               line-height: 45px;
               color: #333;
           }
           .information table {
               padding-bottom: 20px;
           }
           .invoice-box table tr.heading td {
               background: #eee;
               border-bottom: 1px solid #ddd;
               font-weight: bold;
           }
           .invoice-box table tr.details td {
               padding-bottom: 10px;
           }
           .invoice-box table tr.item td {
               border-bottom: 1px solid #eee;
               font-size: 14px;
           }
           .invoice-box table tr.item.last td {
               border-bottom: none;
           }
           .invoice-box table tr.total td:nth-child(2) {
               border-top: 2px solid #eee;
               font-weight: bold;
           }
           @media only screen and (max-width: 600px) {
               .invoice-box table tr.top table td {
                   width: 100%;
                   display: block;
                   text-align: center;
               }
               .invoice-box table tr.information table td {
                   width: 100%;
                   display: block;
                   text-align: center;
               }
           }
           .invoiceInfoBox {
               float: right;
               font-size: 14px;
           }
           .invoiceInfo {
               margin-top: 10px;
               display: flex;
               justify-content: space-between;
           }
           .information span {
               font-weight: 600;
           }
           .note p {
               margin-top: 4px;
               font-size: 13px;
           }
           h2,
           p {
               padding: 0;
               margin: 0;
           }
       </style>
   </head>
   <body>
       <div class="invoice-box">
           <table cellpadding="0" cellspacing="0">
               <tr class="top">
                   <td colspan="2">
                       <table>
                           <tr>
                               <td class="title">
                                   <img src="https://ukbd.app/static/media/UKBD.0c809b708f59760b4a53.png" style="width:100%; max-width:120px;" />
                               </td>
                               <td>
                                   <h2 class="text-right">UK-BD Invoice</h2>
                                   <div class="invoiceInfoBox">
                                       <div class="invoiceInfo">
                                           <div>
                                               <p> Invoice no:  ${data.created}</p>
                                               <p> Invoice date: ${formattedDate}</p>
                                           </div>
                                       </div>
                                   </div>
                               </td>
                           </tr>
                       </table>
                   </td>
               </tr>
               <tr class="information">
                   <td colspan="2">
                       <table>
                           <tr>
                               <th style="padding-left:5px">Host Info:</th>
                               <th style="float: right; padding-right:5px">Bill to:</th>
                           </tr>
                           <tr>
                               <td class="fs14">
                                   <p>
                                       ${data?.metadata?.hostName} <br />
                                       ${data?.metadata?.hostEmail} <br />
                                       ${
                                         data?.metadata?.hostPhoneNumber
                                           ? data?.metadata?.hostPhoneNumber
                                           : "0123456789"
                                       } <br />
                                   </p>
                               </td>
                               <td class="fs14 text-right">
                                    <p>
                                        ${data?.metadata?.renterName} <br />
                                        ${data?.metadata?.renterEmail} <br />
                                        ${
                                          data?.metadata?.renterPhoneNumber
                                            ? data?.metadata?.renterPhoneNumber
                                            : "0123456789"
                                        } <br />
                                    </p>
                               </td>
                           </tr>
                       </table>
                   </td>
               </tr>
               <table>
                   <tr class="heading">
                       <td width="50%">Booking information:</td>
                       <td></td>
                   </tr>
                   <tr class="item">
                       <td>Property address</td>
                       <td class="text-right">${formattedAddress}</td>
                   </tr>
                   <tr class="item">
                       <td>Check in</td>
                       <td class="text-right">${checkInOnlyDate}</td>
                   </tr>
                   <tr class="item">
                       <td>Check out</td>
                       <td class="text-right">${checkOutOnlyDate}</td>
                   </tr>
                   <tr class="item">
                       <td>Stay days</td>
                       <td class="text-right">${data?.metadata?.stayDays}</td>
                   </tr>
                   <tr class="item">
                       <td>Guest</td>
                       <td class="text-right">Adults: ${data?.metadata?.adults}, Children: ${
    data?.metadata?.children
  }, Infants: ${data?.metadata?.infants}, pets: ${data?.metadata?.pets}</td>
                   </tr>
                   <tr class="item">
                       <td>Currency</td>
                       <td class="text-right">${data.currency}</td>
                   </tr>
               </table>
               <br />
               <br />
               <table>
                   <tr class="heading">
                       <td>Payment information:</td>
                       <td class="text-right">Price</td>
                   </tr>
                   <tr class="item">
                       <td>Per night</td>
                       <td class="text-right">$${data?.metadata?.originalPrice}</td>
                   </tr>
                   <tr class="item">
                       <td>Discount percentage</td>
                       <td class="text-right">${data?.metadata?.discountPercentage}%</td>
                   </tr>
                   <tr class="item">
                       <td>($${data?.metadata?.originalPrice} * ${
    data?.metadata?.stayDays
  }) Nights</td>
                       <td class="text-right">$${
                         data?.metadata?.originalPrice *
                         data?.metadata?.stayDays
                       }</td>
                   </tr>
                   <tr class="item">
                       <td>Long stay discount</td>
                       <td class="text-right">$${data?.metadata?.discountAmount}</td>
                   </tr>
                   <tr class="item">
                       <td>UK-BD service fee</td>
                       <td class="text-right">$${data?.metadata?.serviceFee}</td>
                   </tr>
               </table>
               <tr class="information">
                   <td colspan="2">
                       <table>
                           <tr>
                               <td class="note">
                                   <br />
                                   <span>Note:</span>
                                   <br />
                                   <p>Thank you for your business.</p>
                               </td>
                               <td>
                                   <div class="invoiceInfoBox">
                                       <div class="invoiceInfo">
                                           <table>
                                               <tr>
                                                   <td class="fs14" style="text-align:right;">
                                                       <span class="totalPrice">Total :</span> <br />
                                                   </td>
                                                   <td class="fs14  text-right" width="140">
                                                       <span class="totalPrice">$${
                                                         data?.metadata
                                                           ?.actualPrice
                                                       }</span> <br />
                                                   </td>
                                               </tr>
                                           </table>
                                       </div>
                                   </div>
                               </td>
                           </tr>
                       </table>
                   </td>
               </tr>
               <br />
           </table>
       </div>
   </body>
</html>

   `;
};
