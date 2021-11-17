/**
 * @jest-environment jsdom
 */

/**
 * External dependencies
 */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import restApi from '@automattic/jetpack-api';
import sinon from 'sinon';

/**
 * Internal dependencies
 */
import ActivationScreen from '..';
import ActivationScreenSuccessInfo from '../../activation-screen-success-info';
import ActivationScreenControls from '../../activation-screen-controls';

describe( 'ActivationScreen', () => {

	describe( 'Render the ActivationScreen with fresh props', () => {
		const testProps = {
			assetBaseUrl: 'jetpack.com',
			lockImage: '/lock.png',
			siteRawUrl: 'jetpack.com',
			successImage: '/success.png',
		};

		const apiStub = sinon.stub( restApi, 'attachLicenses' );

		afterEach( () => {
			apiStub.resetBehavior();
		} );

		it( 'Renders ActivationScreenControls first', () => {
			const wrapper = shallow( <ActivationScreen { ...testProps } /> );
			const activationScreenControls = wrapper.find( ActivationScreenControls );

			expect( activationScreenControls ).to.have.lengthOf( 1 );
		} );

		it( 'should render an error from API', () => {
			const wrapper = shallow( <ActivationScreen { ...testProps } startingLicense={ 'a' } /> );
			const activationScreenControls = wrapper.find( ActivationScreenControls );

			// stub the api to return an error
			apiStub.returns( Promise.resolve( [ { errors: { 400: [ 'an error' ] } } ] ) );

			// an alternative to a full render and stimulating a click of the activate button
			activationScreenControls.invoke( 'activateLicense' )().then( () => {
				expect( activationScreenControls.prop( 'licenseError') ).to.equal( 'an error' );
			});

		} );

		it( 'should render success with an activated product id from API', () => {
			const wrapper = shallow( <ActivationScreen { ...testProps } startingLicense={ 'a' } /> );
			const activationScreenControls = wrapper.find( ActivationScreenControls );

			// stub the api to return an activated product id
			apiStub.returns( Promise.resolve( [ [ { activatedProductId: 3000 } ] ] ) );

			activationScreenControls.invoke( 'activateLicense' )().then( () => {
				const activationScreenSuccessInfo = wrapper.find( ActivationScreenSuccessInfo );

				expect( activationScreenSuccessInfo.length ).to.have.lengthOf( 1 );
				expect( activationScreenSuccessInfo.prop( 'productId') ).to.equal( 3000 );
			});

		} );

		it( 'should render a generic error for malformed response', () => {
			const wrapper = shallow( <ActivationScreen { ...testProps } startingLicense={ 'a' } /> );
			const activationScreenControls = wrapper.find( ActivationScreenControls );

			// stub the api to return an activated product id
			apiStub.returns( Promise.resolve( [ { bug: 'an error' } ] ) );

			activationScreenControls.invoke( 'activateLicense' )().then( () => {
				expect( activationScreenControls.prop( 'licenseError') ).to.equal( 'An unknown error occurred during license activation. Please try again.' );
			});

		} );

		it( 'should call onActivationSuccess if activation successful', () => {

			const onActivationSuccessSpy = sinon.spy()
			const wrapper = shallow( <ActivationScreen { ...testProps } startingLicense={ 'a' } onActivationSuccess={ onActivationSuccessSpy } /> );
			const activationScreenControls = wrapper.find( ActivationScreenControls );

			// stub the api to return an activated product id
			apiStub.returns( Promise.resolve( [ [ { activatedProductId: 3000 } ] ] ) );

			activationScreenControls.invoke( 'activateLicense' )().then( () => {
				expect( onActivationSuccessSpy.calledOnce ).to.be.true;
			});

		} );

	} );
} );