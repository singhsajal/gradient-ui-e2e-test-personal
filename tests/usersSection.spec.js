import { test, expect } from '@playwright/test';
import loginPage from '../pages/loginPage.js';
import homePage from '../pages/homePage.js';
import basePage from '../pages/basePage.js';
import profilePage from '../pages/profilePage.js';
import { profile } from 'console';
import { config } from '../utils/config.js';
import fs from 'fs';


const base = new basePage()
// const baseUrl = "https://staging-v2.gradientcyber.net/cyber/login"
// const baseUrl="https://uat.gradientcyber.net/cyber/login"
const baseUrl = config.baseUrl;


let context;
test.describe('Test users section ', () => {
    let login;
    let home;
    let page;
    let profile;

     // Set up before all tests

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
          // Start tracing to capture screenshots and snapshots
        await context.tracing.start({
            snapshots: true,
            screenshots: true,
        });
    });

    test.beforeEach(async () => {
        login = new loginPage(page);
        home = new homePage(page);
        profile = new profilePage(page);
    });

    test.afterAll(async () => {
         // Stop tracing and save the trace file
        await context.tracing.stop({ path: 'Testreport/login_Logout_trace.zip' });
        await context.close();
    });


    // Test case for navigating through the user section dropdown options
    test('Test User Section Dropdown Options by navigating each screen', async () => {
        try {
            console.log("Step 1: Navigating to the login page...");
            await login.navigate(baseUrl);

            console.log("Step 2: Logging in with valid credentials...");
            await login.login('sajal@jasbhi.com', 'Focus@123456');

            console.log("Step 3: Verifying that the correct user is logged in ...");
            await expect(page.getByText('Sajal Singh')).toBeVisible();

            console.log("Step 4: Opening user section dropdown ...");
            await page.locator('vex-toolbar-user div').first().click();
            await page.waitForTimeout(2000)

            console.log("Step 5: Clicking on 'Profile Personal Information' link ...");
            await page.getByRole('link', { name: 'Profile Personal Information' }).click();
            await page.waitForTimeout(3000)
            await expect.soft(page.getByText('User profile')).toBeVisible();

            console.log("Step 6: Closing user section dropdown ...");
            await page.locator('vex-toolbar-user div').first().click();
            await page.waitForTimeout(2000)

            console.log("Step 7: Clicking on 'Secure your account2 Factor' link ...");
            await page.locator('a').filter({ hasText: 'Secure your account2 Factor' }).click();
            await page.waitForTimeout(2000)
            await expect.soft(page.getByRole('heading', { name: 'Two Factor Authentication', exact: true })).toBeVisible();
            await page.getByText('clear').click();

            console.log("Step 8: Clicking on 'Org User Manage my' link ...");
            await page.locator('vex-toolbar-user div').first().click();
            await page.waitForTimeout(2000)
            await page.getByRole('link', { name: 'Org User Manage my' }).click();
            await page.waitForTimeout(2000)
            await expect.soft(page.getByRole('heading', { name: 'List of Users AAA MME HQ' })).toBeVisible();

            console.log("Step 9: Clicking on 'Data status Status by' link ...");
            await page.locator('vex-toolbar-user div').first().click();
            await page.waitForTimeout(2000)
            await page.getByRole('link', { name: 'Data status Status by' }).click();
            await page.waitForTimeout(2000)
            await expect.soft(page.getByText('Data Status')).toBeVisible();

            console.log("Step 10: Clicking on 'Role Permissions Role' link ...");
            await page.locator('vex-toolbar-user div').first().click();
            await page.waitForTimeout(2000)
            await page.getByRole('link', { name: 'Role Permissions Role' }).click();
            await page.waitForTimeout(2000)
            await expect.soft(page.locator('span').filter({ hasText: 'Role Permissions' })).toBeVisible();

            console.log("Step 11: Clicking on 'Create user Add new user to' link ...");
            await page.locator('vex-toolbar-user div').first().click();
            await page.waitForTimeout(2000)
            await page.getByRole('link', { name: 'Create user Add new user to' }).click();
            await page.waitForTimeout(2000)
            await page.locator('vex-toolbar-user div').first().click();

            console.log("Step 12: Clicking on 'Impersonate Use platform as a' link ...");
            await page.getByRole('link', { name: 'Impersonate Use platform as a' }).click();
            await page.waitForTimeout(2000)
            await expect.soft(page.getByText('Impersonate users for AAA MME')).toBeVisible();

        } catch (error) {
            console.error("Error occurred:", error);
            throw error; // Rethrow the error to fail the test case
        }
    });

    // Test case for opening the profile screen from the user's section dropdown
    test('open profile screen from users section dropdown ', async () => {
        try {
            console.log("Step 1: Navigating to the login page...");
            await login.navigate(baseUrl);

            console.log("Step 2: Logging in with valid credentials...");
            //await login.validLogin()
            await login.login('sajal@jasbhi.com', 'Focus@123456')

            console.log("Step 3: Verifying that the correct user is logged in ...");

            await expect(page.getByText('Sajal Singh')).toBeVisible();

           
            console.log("Step 4: navigate to profile screen from users profile dropdown ..");
            await page.waitForTimeout(2000)
            //await expect.soft(page.getByRole('link', { name: 'Log out' })).toBeVisible();
            await profile.profile()
            console.log("Step 5: variefy that profile screen is visible")
            await expect(page.getByText('User profile')).toBeVisible();
        } catch (error) {
            console.error("Error occurred:", error);
            throw error; // Rethrow the error to fail the test case
        }

    });

    // Test case for updating the phone number and verifying the update

    test('Update phone number and variefy ', async () => {
        try {
            console.log("Step 1: Navigating to the login page...");
            await login.navigate(baseUrl);

            console.log("Step 2: Logging in with valid credentials...");
            //await login.validLogin()
            await login.login('sajal@jasbhi.com', 'Focus@123456')

            console.log("Step 3: Verifying that the correct user is logged in ...");

            const actualName = await page.getByText('Sajal Singh').textContent();

            await expect.soft(actualName).toBe(" Sajal Singh ");
            console.log("logged in user name is ", actualName)

            // Check if logout button is visible
            console.log("Step 4: navigate to profile screen from users profile dropdown ..");
            await page.waitForTimeout(2000)

            await profile.profile()
            console.log("Step 5: variefy that profile screen is visible")
            await expect(page.getByText('User profile')).toBeVisible()
            console.log("Step 6: Update phone number ")


            await page.getByLabel('Phone Number *').click();
            await page.getByLabel('Phone Number *').press('ControlOrMeta+a');
            await page.getByLabel('Phone Number *').fill('+91 9119015725');
            console.log("Updated Number is +91 9119015725")
            await page.getByRole('button', { name: 'Update settings' }).click();

            await page.goto("https://uat.gradientcyber.net/cyber/profile");

            console.log("Step 7: variefy that number is updated successfully or not")

            await page.locator('.menu-icon').first().click();
            await page.getByRole('link', { name: 'Home' }).click();
            await page.waitForTimeout(5000);

            //await page.goto('https://staging-v2.gradientcyber.net/cyber/profile');
            await page.goto("https://uat.gradientcyber.net/cyber/profile");

            const actualPhoneNumber = await page.getByLabel('Phone Number *').inputValue();
            await expect.soft(actualPhoneNumber).toBe("+91 9119015725");
            console.log("number visible on UI after refresh the page is  ", actualPhoneNumber)

            console.log("Step 8: change to previous number")
            await page.waitForTimeout(2000)

            await profile.profile()
            console.log("Step 9: variefy that profile screen is visible")
            await expect.soft(page.getByText('User profile')).toBeVisible()
            console.log("Step 10: Update previous phone number +91 6376735920 ")


            await page.getByLabel('Phone Number *').click();
            await page.getByLabel('Phone Number *').press('ControlOrMeta+a');
            await page.getByLabel('Phone Number *').fill('+91 6376735920');
            await page.getByRole('button', { name: 'Update settings' }).click();
            await page.waitForTimeout(2000);
            await home.logout();
            await login.login('sajal@jasbhi.com', 'Focus@123456')
            await page.waitForTimeout(5000);
            await profile.profile()


            console.log("Step 11: variefy that previous number is updated successfully or not")
            // await page.goto('https://staging-v2.gradientcyber.net/cyber/profile');
            await page.goto("https://uat.gradientcyber.net/cyber/profile");
            const previousPhoneNumber = await page.getByLabel('Phone Number *').inputValue();
            console.log("Number visible on UI after refreshthe page is ", previousPhoneNumber)
            await expect.soft(previousPhoneNumber).toBe("+91 6376735920");
        } catch (error) {
            console.error("Error occurred:", error);
            throw error; // Rethrow the error to fail the test case
        }
    });




})








