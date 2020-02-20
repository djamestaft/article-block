	/**
 * BLOCK: my-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';
import Article from './Article.js';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
const { InspectorControls, PlainText } = wp.blockEditor;
const { PanelBody, SelectControl, CheckboxControl, TextControl } = wp.components;
var el = wp.element.createElement
var withSelect = wp.data.withSelect

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-article-layout-block', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'article-layout-block - CGB Block' ), // Block title.
	icon: 'smiley', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'layout', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	attributes: {
		content: {
			type: 'string',
			source: 'html',
			selector: 'p'
		},
		categorySelected: {
			type: 'string',
			source: 'html',
			selector: 'p'
		},
		postTypeSelected: {
			type: 'string',
			source: 'html',
			selector: 'p'
		},
		headerSize: {
			type: 'string',
			source: 'html',
			selector: 'p'
		},
		authorHide: {
			type: 'boolean',
			source: 'html',
			selector: 'p'
		},
		categoryHide: {
			type: 'boolean',
			source: 'html',
			selector: 'p'
		},
		dateHide: {
			type: 'boolean',
			source: 'html',
			selector: 'p'
		},
		titleHide: {
			type: 'boolean',
			source: 'html',
			selector: 'p'
		},
		shareHide: {
			type: 'boolean',
			source: 'html',
			selector: 'p'
		},
	},
	edit: withSelect((select) => {
			var posts = select('core').getEntityRecords('postType', 'post', { per_page: 100, _embed: true });
			var cats = 	select('core').getEntityRecords('taxonomy', 'category', { per_page: 100 });
			var postTypes = select('core').getPostTypes();
			return {
				posts,
				cats,
				postTypes,
			};
		})((props) => {		
			var postTypes;
			console.log('LOOKY HERE: : posts', props.posts);
			if (props.postTypes && props.postTypes.length > 1) {
				postTypes = props.postTypes.map((postType) => {
					return {
						label: postType.name,
						value: postType.slug,
					}
				});
			}
			function onChangeHeaderSize( event ) {
				props.setAttributes( { headerSize: event } );
			}
			
			function onChangeAuthorOn( event ) {
				props.setAttributes( { authorHide: event } );
			}
			
			function onChangeHeaderOn( event ) {        
				props.setAttributes( { headerHide: event } );
			}
			
			function onChangeShareOn( event ) {
				props.setAttributes( { shareHide: event } );
			}
			
			function onChangeDateOn( event ) {
				props.setAttributes( { dateHide: event } );
			}
			
			function onChangeCategoryOn( event ) {
				props.setAttributes( { categoryHide: event } );
			}

			function onChangeCategory( event ) {
				props.setAttributes( { categorySelected: event } );
			}
			
			function onChangePostType( event ) {
				props.setAttributes( { postTypeSelected: event } );
			}
			
			function renderPosts(postList) {
				var articlePosts = postList.map((post) => {
	
					var featuredMediaUrl = post._embedded && 
										post._embedded['wp:featuredmedia'] && 
										post._embedded['wp:featuredmedia'][0] &&
										post._embedded['wp:featuredmedia'][0].source_url ? 
										post._embedded['wp:featuredmedia'][0].source_url : 
										"https://via.placeholder.com/150";
	
					return (
						<Article
							title={post.title.rendered}
							imageUrl={featuredMediaUrl}
							headerSize={props.attributes.headerSize ? props.attributes.headerSize : 'h1'}
							excerpt={ post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "")}
							author={post.author ? post.author : 'No Author'}
							cat={post.categories && post.categories[0] ? post.categories[0] : post.type}
							date={post.date}
							showAuthor={!props.attributes.authorHide}
							showHeader={!props.attributes.headerHide}
							showShare={!props.attributes.shareHide}
							showDate={!props.attributes.dateHide}
							showCat={!props.attributes.categoryHide}>
						</Article>
					);
						
				})
				return  <div>{articlePosts}</div>
			}
	
			var categories = [];
	
			if (props.cats && props.cats.length > 1) {
				categories = props.cats.map((cat) => {
					return {
						label: cat.name,
						value: cat.slug,
					}
				});
			}
	
	
			if (!props.posts) {
				return "Loading...";
			}
	
			if (props.posts.length === 0) {
				return "No posts";
			}
			
			var formattedCategories = categories;
			
			return [
				renderPosts(props.posts),
				<InspectorControls>
					<PanelBody title={ __( 'Select Post Type' ) }>
						<SelectControl 
							title={ __( 'Select Post Type' )}
							options={ postTypes }
							onChange={ onChangePostType }>
						</SelectControl>
					</PanelBody>
			
					<PanelBody title={ __( 'Select Category' ) }>
						<SelectControl 
							title={ __( 'Select Category' )}
							options={ formattedCategories }
							onChange={ onChangeCategory }>
						</SelectControl>
					</PanelBody>
							
					<PanelBody title={ __( 'Select Header Size' ) }>
						<SelectControl 
							title={ __( 'Select Header Size' )}
							options={[
								{ label: 'h1', value: 'h1'},
								{ label: 'h2', value: 'h2'},
								{ label: 'h3', value: 'h3'},
								{ label: 'h4', value: 'h4'},
								{ label: 'h5', value: 'h5'},
							]}
							onChange={onChangeHeaderSize}>						
						</SelectControl>
					</PanelBody>
	
					<PanelBody title={ __( 'Hide Post Fields' ) }>
						<CheckboxControl
							label="Author"
							title="Author"						
							onChange={onChangeAuthorOn}>
						</CheckboxControl>
						<CheckboxControl
							label="Header"
							title="Header"
							onChange={onChangeHeaderOn}>
						</CheckboxControl>
						<CheckboxControl
							label="Share"
							title="Share"
							onChange={onChangeShareOn}>
						</CheckboxControl>
						<CheckboxControl
							label="Date"
							title="Date"
							onChange={onChangeDateOn}>
						</CheckboxControl>
						<CheckboxControl
							label="Category"
							title="Category"
							onChange={onChangeCategoryOn}>
						</CheckboxControl>
					</PanelBody>
				</InspectorControls>
			]
		}),			
	save: ( { attributes } ) => {
		return <div>{ JSON.stringify(attributes) }</div>;
	},
});