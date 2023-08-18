export default function waiterService(db) {
  
    // Retrieve the waiter's current schedule by username
    async function getWaiterSchedule(username) {
      return await db.oneOrNone('SELECT * FROM waiters_schedule WHERE username = $1', [username]);
    }
  
    // Save the selected days for the given waiter
    async function saveSelectedDays(username, selectedDays) {
      // Delete existing selected days for the given waiter
      await db.none('DELETE FROM waiters_schedule WHERE username = $1', [username]);
  
      // Insert new selected days
      for (const day of selectedDays) {
        await db.none('INSERT INTO waiters_schedule (username, day) VALUES ($1, $2)', [username, day]);
      }
    }
  
    // Retrieve the days waiters are available, grouped by day
    async function getAvailableDays() {
      return await db.any('SELECT day, COUNT(username) AS waiter_count FROM waiters_schedule GROUP BY day');
    }
  
    return {
      getWaiterSchedule,
      saveSelectedDays,
      getAvailableDays,
    };
  }
  