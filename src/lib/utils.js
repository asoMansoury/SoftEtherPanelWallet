import moment from "jalali-moment";
import jalaliMoment from 'jalali-moment';
import { apiUrls } from "src/configs/apiurls";

export const GenerateRandomPassword = () => {
  var randomstring = Math.random().toString(36).slice(-6);

  return randomstring;
}

export function generateRandomNumberPassword(length) {
  let password = '';
  const possibleCharacters = '0123456789';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * possibleCharacters.length);
    password += possibleCharacters.charAt(randomIndex);
  }

  return password;
}

export const GenerateOneMonthExpiration = (durationMonth) => {
  // Create the current date
  const currentDate = new Date();
  // Get the current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate the next month
  const nextMonth = (currentMonth + durationMonth) % 12; // Add 1 to the current month, modulo 12 to handle year change

  // Calculate the next year
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear; // If current month is December, add 1 to the current year

  // Create the new date one month later
  const oneMonthLater = new Date(nextYear, nextMonth, currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());

  // Format the date
  const formattedDate = `${oneMonthLater.getFullYear()}/${(oneMonthLater.getMonth() + 1).toString().padStart(2, '0')}/${oneMonthLater.getDate().toString().padStart(2, '0')} ${oneMonthLater.getHours().toString().padStart(2, '0')}:${oneMonthLater.getMinutes().toString().padStart(2, '0')}:${oneMonthLater.getSeconds().toString().padStart(2, '0')}`;

  return formattedDate;
}


export const GenerateOneMonthExpirationStartDate = (startDate, durationMonth) => {
  // Create the current date
  const currentDate = new Date(startDate);

  // Get the current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate the next month
  const nextMonth = (currentMonth + durationMonth) % 12; // Add 1 to the current month, modulo 12 to handle year change

  // Calculate the next year
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear; // If current month is December, add 1 to the current year

  // Create the new date one month later
  const oneMonthLater = new Date(nextYear, nextMonth, currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());

  // Format the date
  const formattedDate = `${oneMonthLater.getFullYear()}/${(oneMonthLater.getMonth() + 1).toString().padStart(2, '0')}/${oneMonthLater.getDate().toString().padStart(2, '0')} ${oneMonthLater.getHours().toString().padStart(2, '0')}:${oneMonthLater.getMinutes().toString().padStart(2, '0')}:${oneMonthLater.getSeconds().toString().padStart(2, '0')}`;


  return formattedDate;
}


export function calculateEndDate(startDate, duration) {
  const [datePart, timePart] = startDate.split(' ');
  const [year, month, day] = datePart.split('/');
  const [hour, minute, second] = timePart.split(':');

  const startDateObj = new Date(year, month - 1, day, hour, minute, second);

  const newYear = startDateObj.getFullYear();
  const newMonth = startDateObj.getMonth() + duration;

  // Calculate the new date while handling month overflow
  const newDateObj = new Date(newYear, newMonth, startDateObj.getDate(), startDateObj.getHours(), startDateObj.getMinutes(), startDateObj.getSeconds());

  // Adjust the month and year if necessary
  const adjustedMonth = newDateObj.getMonth();
  const adjustedYear = newDateObj.getFullYear();

  const newDate = new Date(adjustedYear, adjustedMonth, startDateObj.getDate(), startDateObj.getHours(), startDateObj.getMinutes(), startDateObj.getSeconds());
  const formattedDate = newDate.toISOString().replace(/T/, ' ').replace(/\.\d+Z$/, '').replace(/-/g, '/');
  return formattedDate;
}

export const GenerateTestExpiration = (durationDay) => {
  // Create the current date
  const today = new Date();
  // Calculate the expiration date
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + durationDay);

  // Get the date components
  const year = tomorrow.getFullYear().toString().padStart(4, '0');
  const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
  const day = tomorrow.getDate().toString().padStart(2, '0');
  console.log(day)
  const hours = tomorrow.getHours().toString().padStart(2, '0');
  const minutes = tomorrow.getMinutes().toString().padStart(2, '0');
  const seconds = tomorrow.getSeconds().toString().padStart(2, '0');

  // Format the date
  const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
};


export function formatDate(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
}


export const GenerateThreeMonthExpiration = () => {
  // Create the current date
  const currentDate = new Date();

  // Get the current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Calculate the next month
  const nextMonth = (currentMonth + 3) % 12; // Add 1 to the current month, modulo 12 to handle year change

  // Calculate the next year
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear; // If current month is December, add 1 to the current year

  // Create the new date one month later
  const oneMonthLater = new Date(nextYear, nextMonth, currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), currentDate.getSeconds());

  // Format the date
  const formattedDate = `${oneMonthLater.getFullYear()}/${(oneMonthLater.getMonth() + 1).toString().padStart(2, '0')}/${oneMonthLater.getDate().toString().padStart(2, '0')} ${oneMonthLater.getHours().toString().padStart(2, '0')}:${oneMonthLater.getMinutes().toString().padStart(2, '0')}:${oneMonthLater.getSeconds().toString().padStart(2, '0')}`;


  return formattedDate;
}

export function ConvertToPersianDateTime(georgianDateTime) {
  const persianDateTime = jalaliMoment(georgianDateTime).locale('fa').format('YYYY/MM/DD HH:mm:ss');

  return persianDateTime;
}

// export const MONGO_URI = "mongodb+srv://asomansoury:lasoA45Egg99@cluster0.luuqh0d.mongodb.net/?retryWrites=true&w=majority"
export const MONGO_URI = process.env.MONGODB_URL;

export const LOCAL_URL = "http://127.0.0.1:3000";

export const REDIS_URL = "redis://Admin:AdminAso@123@redis-11016.c261.us-east-1-4.ec2.cloud.redislabs.com:11016"
// export const REDIS_URL={
//   host: '135.181.99.122',
//   port: 6379,
//   password: 'AdminAso@123',
// }


export const SendingEmailService = async (to, subject, table) => {

}


export function ConvertCodeToTitle(typeCode) {
  if (typeCode == apiUrls.types.Cisco)
    return "سیسکو";
  else if (typeCode == apiUrls.types.SoftEther)
    return "وی پی ان ایران";

}