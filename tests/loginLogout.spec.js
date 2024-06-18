import { test, expect } from '@playwright/test';
import loginPage from '../pages/loginPage.js';
import homePage from '../pages/homePage.js';
import basePage from '../pages/basePage.js';
import { config } from '../utils/config.js';

const base = new basePage()
//const baseUrl = "https://staging-v2.gradientcyber.net/cyber/login"
const baseUrl = config.baseUrl

let context;
test.describe('Login and Logout Flow', () => {
    let login;
    let home;
    let page;

    // Set up before all tests

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        await context.tracing.start({
            snapshots: true,
            screenshots: true,
        });
    });


    // Login before each test cases

    test.beforeEach(async ({ browser }) => {


        login = new loginPage(page);
        home = new homePage(page);
    });

    // create a report after all test cases completed 

    test.afterAll(async () => {
        await context.tracing.stop({ path: 'Testreport/User_Profile_trace.zip' });
        await context.close();
    });


    
    test('open login page by url', async () => {
        try {
            console.log("Step 1: Navigating to the login page...");
            await login.navigate(baseUrl);

           
            console.log("Step 2: Verifying the page title...");
            await expect.soft(page).toHaveTitle("Gradient Quorum");
        } catch (error) {
            console.error("Error occurred:", error);
            throw error; // Rethrow the error to fail the test case
        }

    });

    test('valid login', async () => {
        try {
            console.log("Step 1: Navigating to the login page...");
            await login.navigate(baseUrl);

            console.log("Step 2: Logging in with valid credentials...");
            //await login.validLogin()
            await login.login('sajal@jasbhi.com', 'Focus@123456')

            console.log("Step 3: Verifying that the correct user is logged in ...");

            await expect.soft(page.getByText('Sajal Singh')).toBeVisible();

            // Check if logout button is visible
            console.log("Step 4: Verifying if the logout button is visible...");
            await expect.soft(page.getByRole('link', { name: 'Log out' })).toBeVisible();
        } catch (error) {
            console.error("Error occurred:", error);
            throw error; // Rethrow the error to fail the test case
        }
    });

    test('invalid login', async () => {
        try {
            console.log("Step 1: Navigating to the login page...");
            await login.navigate(baseUrl);

            console.log("Step 2: Logging in with invalid credentials...");
            await login.login('Sameer@jasbhi.com', '1212121212');


            // Check if error message is visible
            console.log("Step 3: Verifying if the error message is visible...");
            // await expect.soft(page.getByText('Invalid credentials, Please')).toBeVisible();
            await expect.soft(page.getByText(`An internal server error occurred, Please try again later. [Code: 500]
        `)).toBeVisible();
        } catch (error) {
            console.error("Error occurred:", error);
            throw error; // Rethrow the error to fail the test case
        }
    });

    test('logout after valid login', async () => {
        try {
            console.log("Step 1: Navigating to the login page...");
            await login.navigate(baseUrl);

            console.log("Step 2: Logging in with valid credentials...");
            await login.login('sajal@jasbhi.com', 'Focus@123456');
            //await login.validLogin()

            await page.waitForSelector('text=Sajal Singh', { timeout: 15000 });

            // Check if logout button is visible
            console.log("Step 3: Verifying if the logout button is visible after successful login...");
            await expect.soft(page.getByRole('link', { name: 'Log out' })).toBeVisible();

            console.log("Step 4: Logging out...");
            await home.logout();

            // Check if login button is visible
            console.log("Step 5: Verifying if the login button is visible after logout...");
            await expect.soft(page.getByRole('button', { name: 'SIGN IN' })).toBeVisible();
        } catch (error) {
            console.error("Error occurred:", error);
            throw error; // Rethrow the error to fail the test case
        }
    });

    test('Check for news feed is loaded properly or not ', async () => {
        // Navigate to the login page
        await login.navigate(baseUrl);

        // Log in with valid credentials
        await login.login('sajal@jasbhi.com', 'Focus@123456');

        // Make a request to the news feed API
        const response = await context.request.get('https://uat.gradientcyber.net/cyber/uauth/news/feed.json?size=5&offset=0');

        // Verify the status code is 304
        expect.soft(response.status()).toBe(200);
    });









    // test('logout without login', async () => {
    //   await home.navigate(baseUrl);

    //   // Attempt to logout without login
    //   try {
    //     await home.logout();
    //     // Check if login button is still visible
    //     await expect.soft(page.locator('#login')).toBeVisible(); // Adjust selector for login button
    //   } catch (error) {
    //     console.error('Soft assertion failed:', error);
    //   }
    // });
});