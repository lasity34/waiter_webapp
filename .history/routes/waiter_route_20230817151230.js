export default function waiter_route(waiter_service) {
  
  async function show(req, res) {
    const username = req.params.username;
  
    // Define the daysOfWeek array
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
    // Define the timeSlots array
    const timeSlots = ['8am-2pm', '2pm-10pm'];
  
    try {
      const schedule = await waiter_service.getWaiterSchedule(username);
      // Pass the daysOfWeek and timeSlots arrays to the template, along with username and schedule
      res.render('waiters', { username, daysOfWeek, timeSlots, schedule });
    } catch (error) {
      console.error(error);
      res.redirect('/');
    }
  }
  
  
  
    async function updateDays(req, res) {
      const username = req.params.username;
      const selectedDays = req.body.days;
      try {
        await waiter_service.saveSelectedDays(username, selectedDays);
        res.redirect(`/waiters/${username}`);
      } catch (error) {
        console.error(error);
        res.redirect(`/waiters/${username}`);
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
  