const getMessage = require('./get-message');

test('gets message with actor', async() => {
    await expect(getMessage('alexcnichols')).toBe(
        `
    Hello @alexcnichols :wave: - Thanks for opening a release issue. After checking the issue against the guidelines, here are some next steps:
    
    - Add this issue to the **Release tracker** project board, which is organized with columns representing months of the year. Select the column corresponding to this release's next ship date.
    `
    )
});
