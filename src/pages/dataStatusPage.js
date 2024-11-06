import basePage from "./basePage";

class dataStatusPage extends basePage {
    constructor(page) {
        super(page);
    }
    async dataStatus() {
        await this.page.locator('vex-toolbar-user div').first().click();
        await this.page.waitForTimeout(3000);

        await this.page.getByRole('link', { name: 'Data status Status by' }).click();
    }
}
export default dataStatusPage