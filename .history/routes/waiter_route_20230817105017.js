export default function waiterRoute(waiter_service) {
  
    async function show(req, res) {
      const username = req.params.username;
      try {
        const schedule = await waiter_service.getWaiterSchedule(username);
        res.render('waiters', { username, schedule });
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
  