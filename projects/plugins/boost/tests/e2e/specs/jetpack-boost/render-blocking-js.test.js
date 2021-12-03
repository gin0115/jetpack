import { test, expect } from '../../fixtures/base-test.js';
import { boostPrerequisitesBuilder } from '../../lib/env/prerequisites.js';
import { TestContentPage } from '../../lib/pages/index.js';

const testPostTitle = 'Hello World with JavaScript';

test.describe.serial( 'Render Blocking JS module', () => {
	let page;

	test.beforeAll( async ( { browser } ) => {
		page = await browser.newPage();
		await boostPrerequisitesBuilder( page ).withTestContent( [ testPostTitle ] ).build();
	} );

	test( 'JavaScript on a post should be at its original position in the document when the module is inactive', async () => {
		await boostPrerequisitesBuilder( page ).withInactiveModules( [ 'render-blocking-js' ] ).build();
		await TestContentPage.visitByTitle( testPostTitle, page );
		// For this test we are checking if the JavaScript from the test content is still inside its original parent element
		// which has the "render-blocking-js" class.
		const script = await page.locator( '#blockingScript' );
		expect(
			await script.evaluate( element =>
				element.parentElement.classList.contains( 'render-blocking-js' )
			)
		).toBeTruthy();
		// Confirm that the JavaScript was executed.
		await page.locator( '#testDiv' ).isHidden();
	} );

	test( 'JavaScript on a post should be pushed at the bottom of the document when the module is active', async () => {
		// Since the render blocking js module grab all JavaScrip from a document and pushed it at the bottom of the DOM
		// For this test we are checking if the JavaScript from the test content is not anymore in its parent element.
		// which has the "render-blocking-js" class.
		await boostPrerequisitesBuilder( page ).withActiveModules( [ 'render-blocking-js' ] ).build();
		await TestContentPage.visitByTitle( testPostTitle, page );
		const script = await page.locator( '#blockingScript' );
		expect(
			await script.evaluate( element =>
				element.parentElement.classList.contains( 'render-blocking-js' )
			)
		).toBeFalsy();
		// Confirm that the JavaScript was executed.
		await page.locator( '#testDiv' ).isHidden();
	} );
} );