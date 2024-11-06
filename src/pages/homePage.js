import basePage from "./basePage";

class HomePage extends basePage {
    constructor(page) {
        super(page);
        //this.logoutButton = '#logout';
    }

    async logout() {
        await this.page.getByRole('link', { name: 'Log out' }).click();
    }
}

export default HomePage;