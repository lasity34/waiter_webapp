// handlebarsConfig.js
import { engine } from "express-handlebars";
import Handlebars from "handlebars";

const setupHandlebars = (app) => {
  app.engine(
    "handlebars",
    engine({
      defaultLayout: "main",
    })
  );

  Handlebars.registerHelper('generateWaiterSpans', function(waiterList) {
    let divs = '';
    waiterList.forEach(waiter => {
      divs += `<div class="waiter-name">${waiter}</div>`;
    });
    return new Handlebars.SafeString(divs);
  });

  Handlebars.registerHelper('isDayChecked', function(day, timeSlot, checkedDays) {
    const dayTimeKey = `${day}-${timeSlot}`;
    return checkedDays && checkedDays.includes(dayTimeKey);
  });

  app.set("view engine", "handlebars");
  app.set("views", "./views");
}

export default setupHandlebars;
