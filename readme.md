[![Node.js CI](https://github.com/lasity34/waiter_webapp/actions/workflows/node.js.yml/badge.svg)](https://github.com/lasity34/waiter_webapp/actions/workflows/node.js.yml)


# Waiter Availability Web App for Coffee Shop ☕️📆

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Setup](#setup)
5. [Routes](#routes)
6. [Learnings and Reflection](#learnings-and-reflection)
7. [What's Next](#whats-next)

---

## Overview 📝

A web application designed to help manage waiter shifts at a coffee shop. The app allows waiters to select and update the days they can work while enabling the admin to view the availability and reset data for a new week.

login for admin 
name: lyla
password: lyla123
---

## Tech Stack 💻

- **ExpressJS**: Back-end server and routing.
- **PostgreSQL**: Database for persistent data storage.
- **Handlebars**: Server-side templating.
- **Session**: To save admin username.

---

## Features 🌟

- **Waiter Dashboard**: Allows waiters to select and update their available days.
- **Admin Dashboard**: Lets the admin see the availability of waiters for each day.
- **Data Reset**: Allows the admin to clear data for a new week.
- **Availability Status**: Highlights days based on the number of available waiters.

---

## Setup 🛠️

- Project folder is called `waiter_webapp`.
- Deployed on Render.
- Data is stored in PostgreSQL.

---

## Routes 🛣️

- `GET /waiters/:username`: To show waiters a screen where they can select their available days.
- `POST /waiters/:username`: To send the days the waiter is available to the server.
- `GET /days`: To show the admin which days have available waiters.

---

## Learnings and Reflection 📚

- **Skills Used**: Handlebars, ExpressJS, and PostgreSQL were previously known skills.
- **New Skills**: Learned about sessions, multiple tables in PostgreSQL, and Handlebar helpers.
- **Obstacles**: Faced challenges in linking multiple tables and setting up checkboxes with Handlebars.
- **Key Takeaways**: Learned how to use sessions for admin username storage, and how to employ foreign keys to link tables. Gained experience with Handlebar helpers.

---

## What's Next 🛠️

- **User Authentication**: Implement authentication for admin and waiters.
- **Testing**: Add unit tests for the back-end and front-end.
- **UI Enhancements**: Improve the user interface for a better user experience.

