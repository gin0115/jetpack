/**
 * External dependencies
 */
import { getDate, date, dateI18n } from '@wordpress/date';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { createInterpolateElement, useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { getRedirectUrl } from '@automattic/jetpack-components';

/**
 * Internal dependencies
 */
import { STORE_ID } from '../store';
import StatBlock from './StatBlock';
import './backups-style.scss';
import PostsIcon from './icons/posts.svg';
import CloudIcon from './icons/cloud.svg';
import CloudAlertIcon from './icons/cloud-alert.svg';
import UploadsIcon from './icons/uploads.svg';
import PluginsIcon from './icons/plugins.svg';
import ThemesIcon from './icons/themes.svg';
import BackupAnim1 from './icons/backup-animation-1.svg';
import BackupAnim2 from './icons/backup-animation-2.svg';
import BackupAnim3 from './icons/backup-animation-3.svg';

/* eslint react/react-in-jsx-scope: 0 */
const Backups = () => {
	// State information
	const [ progress, setProgress ] = useState( 0 );
	const [ trackProgress, setTrackProgress ] = useState( 0 );
	const [ latestTime, setLatestTime ] = useState( '' );
	const [ stats, setStats ] = useState( {
		posts: 0,
		uploads: 0,
		plugins: 0,
		themes: 0,
	} );
	const domain = useSelect( select => select( STORE_ID ).getCalypsoSlug(), [] );

	const BACKUP_STATE = {
		LOADING: 0,
		IN_PROGRESS: 1,
		NO_BACKUPS: 2,
		NO_BACKUPS_RETRY: 3,
		NO_GOOD_BACKUPS: 4,
		COMPLETE: 5,
	};
	const [ backupState, setBackupState ] = useState( BACKUP_STATE.LOADING );

	const progressInterval = 1 * 1000; // How often to poll for backup progress updates.

	// Loads data on startup and whenever trackProgress updates.
	useEffect( () => {
		apiFetch( { path: '/jetpack/v4/backups' } ).then(
			res => {
				// If we have no backups don't load up stats.
				let latestBackup = null;
				if ( res.length === 0 ) {
					setBackupState( BACKUP_STATE.NO_BACKUPS );
				} else if ( res.length === 1 && 'error-will-retry' === res[ 0 ].status ) {
					setBackupState( BACKUP_STATE.NO_BACKUPS_RETRY );
				} else {
					// Check for the first completed backups.
					res.forEach( backup => {
						if ( null !== latestBackup ) {
							return;
						}

						if ( 'finished' === backup.status && backup.stats ) {
							latestBackup = backup;
							setBackupState( BACKUP_STATE.COMPLETE );
						}
					} );

					// Only the first backup can be in progress.
					if ( null === latestBackup && 'started' === res[ 0 ].status ) {
						latestBackup = res[ 0 ];
						setProgress( latestBackup.percent );
						setBackupState( BACKUP_STATE.IN_PROGRESS );
					}

					// No complete or in progress backups.
					if ( ! latestBackup ) {
						setBackupState( BACKUP_STATE.NO_GOOD_BACKUPS );
						return;
					}

					// Setup data for COMPLETE state.
					if ( 'finished' === latestBackup.status ) {
						const postsTable = latestBackup.stats.prefix + 'posts';
						setStats( {
							plugins: latestBackup.stats.plugins.count,
							themes: latestBackup.stats.themes.count,
							uploads: latestBackup.stats.uploads.count,
							posts: latestBackup.stats.tables[ postsTable ].post_published,
						} );
						setLatestTime( date( 'c', latestBackup.last_updated + '+00:00' ) );
					}
				}

				// Repeat query for NO_BACKUPS (before first) and IN_PROGRESS
				if ( res.length === 0 || 'started' === latestBackup.status ) {
					// Grab progress and update every progressInterval until complete.
					setTimeout( () => {
						setTrackProgress( trackProgress + 1 );
					}, progressInterval );
				}
			},
			() => {
				setBackupState( BACKUP_STATE.NO_GOOD_BACKUPS );
			}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ trackProgress ] );

	const renderInProgressBackup = ( showProgressBar = true ) => {
		return (
			<div className="jp-row">
				<div className="lg-col-span-5 md-col-span-8 sm-col-span-4">
					{ showProgressBar && (
						<div className="backup__progress">
							<div className="backup__progress-info">
								<p>{ __( 'Backing up Your Groovy Site…', 'jetpack-backup' ) }</p>
								<p className="backup__progress-info-percentage">{ progress }%</p>
							</div>
							<div className="backup__progress-bar">
								<div
									className="backup__progress-bar-actual"
									style={ { width: progress + '%' } }
								></div>
							</div>
						</div>
					) }
					<h1>{ __( 'Your first cloud backup will be ready soon', 'jetpack-backup' ) }</h1>
					<p>
						{ __(
							'The first backup usually takes a few minutes, so it will become available soon.',
							'jetpack-backup'
						) }
					</p>
					<p>
						{ createInterpolateElement(
							__(
								'In the meanwhile, you can start getting familiar with your <a>backup management on Jetpack.com</a>.',
								'jetpack-backup'
							),
							{
								a: (
									<a
										href={ getRedirectUrl( 'jetpack-backup', { site: domain } ) }
										target="_blank"
										rel="noreferrer"
									/>
								),
							}
						) }
					</p>
				</div>
				<div className="lg-col-span-1 md-col-span-4 sm-col-span-0"></div>
				<div className="backup__animation lg-col-span-6 md-col-span-2 sm-col-span-2">
					<img className="backup__animation-el-1" src={ BackupAnim1 } alt="" />
					<img className="backup__animation-el-2" src={ BackupAnim2 } alt="" />
					<img className="backup__animation-el-3" src={ BackupAnim3 } alt="" />
				</div>
			</div>
		);
	};

	const formatDateString = dateString => {
		const todayString = __( 'Today', 'jetpack-backup' );
		const todayDate = getDate();
		let backupDate = todayString;
		if ( dateI18n( 'zY', todayDate ) !== dateI18n( 'zY', dateString ) ) {
			backupDate = dateI18n( 'M j', dateString );
		}
		const backupTime = dateI18n( 'g:i A', dateString );

		return backupDate + ', ' + backupTime;
	};

	const renderCompleteBackup = () => {
		return (
			<div className="jp-row">
				<div className="lg-col-span-3 md-col-span-4 sm-col-span-4">
					<div className="backup__latest">
						<img src={ CloudIcon } alt="" />
						<h2>{ __( 'Latest Backup', 'jetpack-backup' ) }</h2>
					</div>
					<h1>{ formatDateString( latestTime ) }</h1>
					<a
						className="button is-full-width"
						href={ getRedirectUrl( 'jetpack-backup', { site: domain } ) }
						target="_blank"
						rel="noreferrer"
					>
						{ __( 'See all your backups', 'jetpack-backup' ) }
					</a>
				</div>
				<div className="lg-col-span-1 md-col-span-4 sm-col-span-0"></div>
				<div className="lg-col-span-2 md-col-span-2 sm-col-span-2">
					<StatBlock
						icon={ PostsIcon }
						label={ __( 'Posts', 'jetpack-backup' ) }
						value={ stats.posts }
					/>
				</div>
				<div className="lg-col-span-2 md-col-span-2 sm-col-span-2">
					<StatBlock
						icon={ UploadsIcon }
						label={ __( 'Uploads', 'jetpack-backup' ) }
						value={ stats.uploads }
					/>
				</div>
				<div className="lg-col-span-2 md-col-span-2 sm-col-span-2">
					<StatBlock
						icon={ PluginsIcon }
						label={ __( 'Plugins', 'jetpack-backup' ) }
						value={ stats.plugins }
					/>
				</div>
				<div className="lg-col-span-2 md-col-span-2 sm-col-span-2">
					<StatBlock
						icon={ ThemesIcon }
						label={ __( 'Themes', 'jetpack-backup' ) }
						value={ stats.themes }
					/>
				</div>
			</div>
		);
	};

	const renderNoGoodBackups = () => {
		return (
			<div className="jp-row">
				<div className="lg-col-span-5 md-col-span-4 sm-col-span-4">
					<img src={ CloudAlertIcon } alt="" />
					<h1>{ __( "We're having trouble backing up your site", 'jetpack-backup' ) }</h1>
					<p>
						{ createInterpolateElement(
							__(
								' <a>Get in touch with us</a> to get your site backups going again.',
								'jetpack-backup'
							),
							{
								a: (
									<a
										//TODO: we may want to add a specific redirect for Backup plugin related issues
										href={ getRedirectUrl( 'jetpack-contact-support', { site: domain } ) }
										target="_blank"
										rel="noreferrer"
									/>
								),
							}
						) }
					</p>
				</div>
				<div className="lg-col-span-1 md-col-span-4 sm-col-span-0"></div>
				<div className="lg-col-span-6 md-col-span-2 sm-col-span-2"></div>
			</div>
		);
	};

	const renderLoading = () => {
		return <div className="jp-row"></div>;
	};

	return (
		<div className="jp-wrap jp-content">
			{ BACKUP_STATE.LOADING === backupState && renderLoading() }
			{ BACKUP_STATE.NO_BACKUPS === backupState && renderInProgressBackup() }
			{ BACKUP_STATE.NO_BACKUPS_RETRY === backupState && renderInProgressBackup( false ) }
			{ BACKUP_STATE.IN_PROGRESS === backupState && renderInProgressBackup() }
			{ BACKUP_STATE.COMPLETE === backupState && renderCompleteBackup() }
			{ BACKUP_STATE.NO_GOOD_BACKUPS === backupState && renderNoGoodBackups() }
		</div>
	);
};

export default Backups;
