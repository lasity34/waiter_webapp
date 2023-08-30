export default function waiter_route(waiter_service) {

  async function updateDays(req, res) {
    const username = req.params.username;
    const selectedDays = req.body.days;
 
    try {
      await waiter_service.saveSelectedDays(username, selectedDays);
      const checkedDays = await waiter_service.getAvailableDays(). 
      req.session.checkedDays = checkedDays;
      req.session.notification = "Waiter days added"; 
      res.redirect(`/waiters/${username}`);
   
    } catch (error) {
      console.error("Error while saving selected days:", error); // Debugging log for error
      res.redirect(`/waiters/${username}`);
    }
  }
  
  
  async function show(req, res) {
    const username = req.params.username;
  
    // Define the daysOfWeek array
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
    // Define the timeSlots array
    const timeSlots = ['lunch', 'supper'];
  
    try {
      const schedule = await waiter_service.getWaiterSchedule(username);
      const checkedDays = req.session.checkedDays || []
      const notification = req.session.notification;
      req.session.notification = null
      res.render('waiters', { username, daysOfWeek, timeSlots, schedule, notification, checkedDays});
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  }
  
  
  

    async function showAvailableDays(req, res) {
      try {
        const availableDays = await waiter_service.getAvailableDays();
        res.render('days', { availableDays });
      } catch (error) {
        console.error(error);
        res.redirect('/'); 
      }
    }
  
    return {
      show,
      updateDays,
      showAvailableDays,
    };
  }
  