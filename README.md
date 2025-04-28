# fullstack-node-vue
Full-stack application built with NestJS, Vue.js (Vuetify), and PostgreSQL. Features RESTful API examples, basic authentication, and frontend reusable CRUD tables designed for quick setup and easy customization.


**Full-Stack Node.js Application with NestJS, Vue.js (Vuetify), and PostgreSQL**

---

## ✨ Features

- **NestJS Backend** with a modular, scalable structure
- **Vue.js + Vuetify Frontend** for a modern, responsive UI
- **PostgreSQL Database** with TypeORM for data management
- **RESTful API Examples** for easy integration
- **Basic User Authentication** (login, protected routes)
- **Reusable CRUD Tables** on the frontend, designed for quick setup and easy customization
- **Environment Configuration** for flexible deployments
- **Scalable Architecture** ready for future extensions

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [PostgreSQL](https://www.postgresql.org/)
- [Yarn](https://classic.yarnpkg.com/lang/en/) or [npm](https://www.npmjs.com/)

Clone the repository:

```
git clone https://github.com/saminqa/fullstack-node-vue.git
```

Navigate into the project directory:

```
cd fullstack-node-vue
```

## 🛠️ How to Run the Project
### 1. Backend Setup
Go to the <backend> folder:

```
cd api
```

Install dependencies:

```
npm install or yarn install
```
Create a .env file in the main folder and configure your database connection:

```
DATABASE_USER=your_user
DATABASE_PASS=your_password
DATABASE_HOST=localhost_or_your_host
DATABASE_NAME=your_database_name
DATABASE_PORT=your_port
COOKIE_NAME=your_cookie_name
COOKIE_KEYS=your_cooKie_KeYs
```
##### Make 1 user to be able to signin by making a POST request in yourhost/auth/signup
Run the backend server:

```
npm run start:dev or yarn start:dev
```

### 2. Frontend Setup
Open a new terminal window. Go to the frontend folder:

```
cd client
```
Install frontend dependencies:

```
npm install or yarn install
```
Run the frontend development server:

```
npm run dev or yarn serve (npm serve)
```

#### The application will be available at:
#### http://localhost:5173

### See individual ReadMe in the api and clinet folders.


### 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
