/**
 * External Dependencies
 */
import filesize from 'filesize';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { createInterpolateElement } from '@wordpress/element';
import { escapeHTML } from '@wordpress/escape-html';
import { getJWT, useUploader } from './use-uploader';
import {
    Button,
	Icon,
} from '@wordpress/components';
import { useContext, useEffect, useRef, useState } from '@wordpress/element';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
import { VideoPressIcon } from '../../../shared/icons';
import { VideoPressBlockContext } from '../components';
import './style.scss';

export default function ResumableUpload( { file } ) {
	console.log( file );
	const blockProps = useBlockProps( {
	    className: "resumable-upload",
	} );

	if ( ! file ) {
		return null;
	}

	const [ progress, setProgress ] = useState( 0 );
	const [ hasPaused, setHasPaused ] = useState( false );
	const [ tusUploader, setTusUploader ] = useState( null );
	const [ error, setError ] = useState( null );
	const tusUploaderRef = useRef( null );
	tusUploaderRef.current = tusUploader;
	const { onUploadFinished } = useContext( VideoPressBlockContext );

	const startUpload = () => {
		const onError = ( error ) => {
			setError( error );
		};

		const onProgress = ( bytesUploaded, bytesTotal ) => {
			const percentage = ( bytesUploaded / bytesTotal ) * 100;
			setProgress( percentage );
		};

		const onSuccess =  ( guid ) => {
			onUploadFinished( guid );
			// TODO: Load video? (Conversion screen) Need the guid
		};

		const uploader = useUploader( {
			onError,
			onProgress,
			onSuccess,
		} );

		getJWT().then( ( jwtData ) => {
			const newUploader = uploader( file, jwtData );
			setTusUploader( newUploader );
		} ).catch( ( error ) => {
			setError( error );
		} );
	}

	useEffect(() => {
		// Kicks things off.
		startUpload();

		// Stop the upload when the block is removed.
		return () => {
			if ( null !== tusUploaderRef.current ) {
				tusUploaderRef.current.abort();
			}
		};
	}, []);

	const roundedProgress = Math.round( progress );
	const cssWidth = { width: `${roundedProgress}%` };

	const pauseOrResumeUpload = () => {
		if ( tusUploader ) {
			if ( hasPaused ) {
				tusUploader.start();
			} else {
				tusUploader.abort();
			}
			setHasPaused( ! hasPaused );
		}
	};

	const restartUpload = () => {
		setError( null );
		startUpload();
	};

	const escapedFileName = escapeHTML( file.name );
	const fileNameLabel = createInterpolateElement(
		sprintf(
			/* translators: Placeholder is a video file name. */
			__(
				'Uploading <strong>%s</strong>',
				escapedFileName,
				'jetpack'
			),
			escapedFileName
		),
		{ strong: <strong /> }
	)

	const fileSizeLabel = filesize( file.size );

    return (
		<div { ...blockProps }>
			<div className="resumable-upload__logo">
				<Icon icon={ VideoPressIcon } />
				<div className="resumable-upload__logo-text">{ __( 'Video', 'jetpack' ) }</div>
			</div>
			{ null !== error ? (
				<div className="resumable-upload__error">
					<div className="resumable-upload__error-text">{ __( 'An error was encountered during the upload. Check your network connection.' ) }</div>
					<Button isPrimary onClick={ () => restartUpload() }>{ __( 'Try again', 'jetpack' ) }</Button>
					<Button isSecondary onClick={ () => onUploadFinished( error ) } className="resumable-upload__error-cancel">{ __('Cancel', 'jetpack' ) }</Button>
				</div>
			) : (
				<div className="resumable-upload__status">
					<div className="resumable-upload__file-info">
						<div className="resumable-upload__file-name">{ fileNameLabel }</div>
						<div className="resumable-upload__file-size">{ fileSizeLabel }</div>
					</div>
					<div className="resumable-upload__progress">
						<div className="resumable-upload__progress-loaded" style={ cssWidth } />
					</div>
					<div className="resumable-upload__actions">
							<div className="videopress-upload__percent-complete">{ `${roundedProgress}%` }</div>
							<Button
								isLink
								onClick={ () => pauseOrResumeUpload() }>
									{ hasPaused ? 'Resume' : 'Pause' }
							</Button>
						</div>
				</div>
			) }
		</div>
    );
}

