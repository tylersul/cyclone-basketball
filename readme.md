# :tornado: [Cyclone Basketball Analytics](http://cycloneanalytics.herokuapp.com/) :tornado:

Full stack NodeJS web application with a growing database of Iowa State Men's basketball players and an ever-evolving set of advanced analytics tools.

![Website](https://img.shields.io/website?down_color=red&down_message=offline&up_color=brightgreen&up_message=online&url=https%3A%2F%2Fcycloneanalytics.herokuapp.com)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/c76fdc8c5b7c44c28af5cb68360639bd)](https://www.codacy.com/gh/tylersul/express-cyclone-analytics-web-app/dashboard?utm_source=github.com&utm_medium=referral&utm_content=tylersul/express-cyclone-analytics-web-app&utm_campaign=Badge_Grade)

&nbsp;
&nbsp;
&nbsp;
&nbsp;

## Lessons Learned :bulb:

-   First full-stack web app
-   Introduction to [Express.js](https://expressjs.com/) Node web framework
-   Introduction to [Bootstrap](https://getbootstrap.com/) responsive front-end web design
-   Application deployment using [Heroku](https://www.heroku.com/) and database deployment to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
-   Automated code reviews through [Codacy](https://app.codacy.com/gh/tylersul/express-cyclone-analytics-web-app/dashboard?branch=master)

&nbsp;
&nbsp;

## Tech Stack

| Front-End   |  Back-End  | Database |  Deployment   | Testing |
| ----------- | :--------: | :------: | :-----------: | :-----: |
| HTML5       |  Node.js   | MongoDB  |    Heroku     |  Jest   |
| CSS3        | Express.js | Mongoose | MongoDB Atlas | Codacy  |
| Javascript  |    EJS     |    -     |    GitHub     |    -    |
| Bootstrap 4 |     -      |    -     |       -       |    -    |

&nbsp;
&nbsp;

## In-Flight Work

-   Add Jest tests for unit testing
-   Automate code reviews with Codacy & CodeClimate
-   CI / CD with an undetermined provider

## Application Features

-   RESTful routing
-   Authentication and authorization: User sign-up & login, administrator management role

## Code Standards and Best Practices

To ensure consistent coding style, quality, and workflows across the project, we use **ESLint**, **Prettier**, and **Husky**. This document outlines how to set up, run, and adhere to these standards.

---

### 1. Code Style and Formatting

We enforce coding standards using:

-   **ESLint**: For detecting and fixing common coding errors.
-   **Prettier**: For automatic code formatting.

#### **Setup**

1. Ensure all dependencies are installed:
    ```bash
    npm install
    ```
2. Confirm ESLint and Prettier are configured correctly:

-   ESLint: **.eslintrc.json**
-   Prettier: **.prettierrc**

#### **Running ESLint**

To check for linting issues:Running ESLint
To check for linting issues:

bash
Copy code
npm run lint
To automatically fix linting issues:

bash
Copy code
npm run lint -- --fix
Running Prettier
To format the codebase:

bash
Copy code
npm run format

#### 2. Pre-Commit Hooks

We use Husky and lint-staged to ensure code quality before committing changes.

How It Works
On every commit, lint-staged runs ESLint and Prettier on changed files.
If issues are found, the commit will fail until they are resolved.
Manual Setup (Optional)
If you’re setting up the project for the first time, run:

bash
Copy code
npx husky install
What Happens on Commit
ESLint runs to check for errors.
Prettier formats the code.
If all checks pass, the commit is created.

## Acknowledgments

The inspiration for this project came from [Colt Steele's YelpCamp](https://github.com/Colt/yelp-camp-refactored) while taking his web development bootcamp.

&nbsp;
&nbsp;

## Related projects

Here's a list of other related projects that I created or utilized throughout the development of this full stack application:

-   [CBB Reference Scraping for Player Stats](https://github.com/tylersul/js-cbb-web-scraper)
-   [ESPN College Basketball Web Scraper for Teams](https://github.com/tylersul/js-espn-cbb-scraper)
