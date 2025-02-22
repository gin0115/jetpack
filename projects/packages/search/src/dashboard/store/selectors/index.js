/**
 * Internal dependencies
 */
import siteDataSelectors from './site-data';
import jetpackSettingSelectors from './jetpack-settings';
import sitePlanSelectors from './site-plan';
import userDataSelectors from './user-data';
import noticeSelectors from 'components/global-notices/store/selectors';
import featureSelectors from './feature';

const selectors = {
	...siteDataSelectors,
	...jetpackSettingSelectors,
	...sitePlanSelectors,
	...userDataSelectors,
	...noticeSelectors,
	...featureSelectors,
};

export default selectors;
