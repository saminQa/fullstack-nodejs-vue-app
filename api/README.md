README

# Application Overview

This application is a basic structure for a RESTful API, built using Node.js and TypeScript, NestJS framework for back-end structure, Postgres database with TypeORM integration. The front-ent is built with Vue and vuetify.

## Customization Options

To adapt this application to your specific needs, consider the following modifications:

### Database Configuration:

Set up your databse, update the database connection settings in the .env file in the main folder to match your database management system and credentials. Set up database migrations, and ensure environment variables are correctly loaded. Look in src->config->typeorm.config.ts for credentials and TypeORM synchonize option. Configure ports + cookie session name / keys in main.ts. Edit entites to match your data model and ensure proper mapping to the database schema. Don't forget to edit also the dtos in the modules to match your entities / needs.

### API Endpoints:

Modify or add API endpoints in the module controllers to accommodate your specific use case. Edit service logic for each crud operation to fit your needs.

### Security Measures:

This app has a basic authentification against user and password stored in the database.

### Error Handling:

Customize error handling mechanisms to suit your application's requirements.

### Dependency Updates:

Update dependencies in the package.json file to ensure compatibility with your project's requirements.

## Getting Started

Clone the repository: git clone https://github.com/saminqa/your-app.git
Cd to both api and client folders and
Install dependencies: npm install or yarn install

```bash
$ npm install
```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Running the back-end app (api)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the front-end app (client)

```bash
# development
$ npm run dev

# preview mode
$ npm run && vite preview

# production mode
$ vite build
```
