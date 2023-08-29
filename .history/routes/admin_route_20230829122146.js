export default function admin_route(admin_service, waiter_service) {
 

  async function show(req, res) {
    const username = req.params.username;
    const waiters = await admin_service.listWaiters();
    const availableDays = await waiter_service.getAvailableDays();


    const waitersCount = waiters.length
  
    // Constructing the schedule object
    const schedule = {
      'lunch': { 'mon': [], 'tue': [], 'wed': [], 'thu': [], 'fri': [], 'sat': [], 'sun': [] },
      'supper': { 'mon': [], 'tue': [], 'wed': [], 'thu': [], 'fri': [], 'sat': [], 'sun': [] },
    };
  
    availableDays.forEach((shift) => {
      const time_slot_key = shift.time_slot === 'lunch' ? 'lunch' : 'supper';
      const day_key = shift.day.slice(0, 3).toLowerCase();
      schedule[time_slot_key][day_key] = shift.usernames
    });
    

    const notification = req.session.notification
    res.render("admin", { username, waiters, schedule, notification, waitersCount });
  }
  
  

  async function updateWaiter(req, res) {
    try {
      const { waiterId, name, status } = req.body;
      const updatedWaiter = await waiter_service.updateWaiter(
        waiterId,
        name,
        status
      );

      if (updatedWaiter) {
        res.status(200).send("Waiter updated successfully");
      } else {
        res.status(404).send("Waiter not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  }





  async function deleteUser(req, res) {
    try {
      const { username } = req.body;
      const adminUsername = req.params.username;
  
      // Delete the user's shifts in the waiters_schedule table first
      await admin_service.deleteWaiterSchedule(username);
  
      // Then delete the user
      const deleted = await admin_service.deleteUser(username);
  
      if (deleted) {
        req.session.notification = 'User deleted successfully';
        res.redirect(`/admin/${adminUsername}`);
      } else {
        req.session.notification = 'Failed to delete user';
        res.redirect(`/admin/${adminUsername}`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).render("error", { message: "An error occurred" });
    }
  }

  
  async function removeWaiter(req, res) {
    const { day, shift, waiter } = req.body;
    const adminUsername = req.params.username;
    try {
      // Logic to remove the waiter from the specific day and shift
      await waiter_service.removeWaiterFromShift(waiter, day, shift);
      res.redirect(`/admin/${adminUsername}`);// Redirect back to the admin page
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  }

  async function resetSchedule(req, res) {
  try {
    await waiter_service.resetAllShifts();
    req.session.notification = 'Schedule has been reset.';
    res.redirect(`/admin/${adminUsername}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
}
  
  
  

  return {
  
    show,
    updateWaiter,
    deleteUser,
    removeWaiter,
    resetSchedule
  };
}
