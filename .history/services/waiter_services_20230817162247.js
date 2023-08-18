import bcrypt from 'bcrypt';

export default function waiterService(db) {
  // Retrieve the waiter's current schedule by username
  async function getWaiterSchedule(username) {
    return await db.any('SELECT * FROM waiters_schedule WHERE username = $1', [username]);
  }

  // Retrieve the waiter by username
  async function getWaiterByUsername(username) {
    return await db.oneOrNone('SELECT * FROM waiters WHERE username = $1', [username]);
  }

  // Verify password against the hashed password
  async function verifyPassword(password, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  // Verify credentials (username and password)
  async function verifyCredentials(username, password) {
    const waiter = await getWaiterByUsername(username);
    if (waiter) {
      const isPasswordValid = await verifyPassword(password, waiter.password);
      if (isPasswordValid) {
        return waiter;
      }
    }
    return null;
  }

  // Save the selected days and time slots for the given waiter
  async function saveSelectedDays(username, selectedDays) {
    await db.none('DELETE FROM waiters_schedule WHERE username = $1', [username]);
  
    for (const day in selectedDays) {
      for (const time_slot in selectedDays[day]) {
        if (selectedDays[day][time_slot] === 'on') { // Check if the checkbox was ticked
          await db.none('INSERT INTO waiters_schedule (username, day, time_slot) VALUES ($1, $2, $3)', [username, day, time_slot]);
        }
      }
    }
  }
  

  // Retrieve the days and time slots waiters are available, grouped by day and time slot
  async function getAvailableDays() {
    return await db.any('SELECT day, time_slot, ARRAY_AGG(username) AS usernames FROM waiters_schedule GROUP BY day, time_slot');
  }
  
  return {
    getWaiterSchedule,
    saveSelectedDays,
    getAvailableDays,
    verifyCredentials, // Add this line
  };
}

