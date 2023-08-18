export default function waiterService(db) {
  
  // Retrieve the waiter's current schedule by username
  async function getWaiterSchedule(username) {
    return await db.any('SELECT * FROM waiters_schedule WHERE username = $1', [username]);
  }

  // Save the selected days and time slots for the given waiter
  async function saveSelectedDays(username, selectedDays) {
    // Delete existing selected days and time slots for the given waiter
    await db.none('DELETE FROM waiters_schedule WHERE username = $1', [username]);

    // Insert new selected days and time slots
    for (const day in selectedDays) {
      for (const time_slot of selectedDays[day]) {
        await db.none('INSERT INTO waiters_schedule (username, day, time_slot) VALUES ($1, $2, $3)', [username, day, time_slot]);
      }
    }
  }

  // Retrieve the days and time slots waiters are available, grouped by day and time slot
  async function getAvailableDays() {
    return await db.any('SELECT day, time_slot, COUNT(username) AS waiter_count FROM waiters_schedule GROUP BY day, time_slot');
  }

  return {
    getWaiterSchedule,
    saveSelectedDays,
    getAvailableDays,
  };
}
