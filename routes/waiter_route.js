export default function waiter_route(waiter_service) {

  async function updateDays(req, res) {
    const username = req.params.username;
    const selectedDays = req.body.days;

    if (Object.keys(selectedDays).length < 3) {
      req.session.notification = "Please select at least 3 days";
      return res.redirect(`/waiters/${username}`);
    }
    
    try {
      await waiter_service.saveSelectedDays(username, selectedDays);
      const checkedDays = await waiter_service.getSelectedDays(username);
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
  
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = ['lunch', 'supper'];
  
    try {
      let checkedDays = req.session.checkedDays;
      if (!checkedDays) {
        checkedDays = await waiter_service.getSelectedDays(username);
        req.session.checkedDays = checkedDays;
      }
      const notification = req.session.notification;
      req.session.notification = null;

      const scheduleData = timeSlots.map(timeSlot => {
        return {
          timeSlot,
          days: daysOfWeek.map(day => {
            const dayTimeKey = `${day}-${timeSlot}`;
            const isChecked = checkedDays.includes(dayTimeKey);
            return { day, isChecked };
          })
        };
      });
   
      res.render('waiters', { username, daysOfWeek, timeSlots, scheduleData, notification, checkedDays });

      
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
  