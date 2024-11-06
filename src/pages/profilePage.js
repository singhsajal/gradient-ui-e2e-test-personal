import basePage from "./basePage";

class profilePage extends basePage {
    constructor(page) {
        super(page);
    }
    async profile() {
        await this.page.locator('vex-toolbar-user div').first().click();
        await this.page.waitForTimeout(3000);

        await this.page.getByRole('link', { name: 'Profile Personal Information' }).click();
    }
}
export default profilePage