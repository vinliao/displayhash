<script context="module">
	import { request, gql } from 'graphql-request';

	// if params not integer, return error
	// todo: maybe can be transferred to endpoint
	export async function load({ params, url }) {
		const ipfsGateway = 'https://gateway.fxhash2.xyz/ipfs/';
		const graphqlUrl = 'https://api.fxhash.xyz/graphql';
		const slugUrl = 'https://fxhash.xyz/generative/slug/';
		const query = gql`
			query ExampleQuery($generativeTokenId: Float, $take: Int, $skip: Int) {
				generativeToken(id: $generativeTokenId) {
					id
					name
					author {
						name
					}
					displayUri
					slug
					objktsCount
					balance
					metadata
					thumbnailUri
					objkts(take: $take, skip: $skip) {
						metadata
						iteration
						owner {
							name
							id
						}
					}
				}
			}
		`;
		let page = url.searchParams.get('page');
		page = Number(page);
		const gentksPerPage = 50;
		const generativeId = Number(params.id);
		if (!page) page = 1;
		const variables = {
			generativeTokenId: generativeId,
			skip: (page - 1) * gentksPerPage,
			take: gentksPerPage
		};

		const result = await request(graphqlUrl, query, variables);
		const author = result.generativeToken.author.name;
		const description = result.generativeToken.metadata.description;
		const slug = slugUrl + result.generativeToken.slug;
		const display = ipfsGateway + result.generativeToken.displayUri.slice(7);
		const thumbnail = ipfsGateway + result.generativeToken.thumbnailUri.slice(7);
		const objktsCount = result.generativeToken.objktsCount;
		const balance = result.generativeToken.balance;

		let gentkThumbnails = [];
		let gentkDisplays = [];
		let gentkIterations = [];
		let gentkOwner = [];

		result.generativeToken.objkts.forEach((objkt) => {
			const gentkThumbnail = objkt.metadata.thumbnailUri;
			gentkThumbnails.push(ipfsGateway + gentkThumbnail.slice(7));
			gentkDisplays.push(ipfsGateway + objkt.metadata.displayUri.slice(7));
			gentkIterations.push(objkt.iteration);
			gentkOwner.push(objkt.owner);
		});

		return {
			status: 200,
			props: {
				name: result.generativeToken.name,
				generativeId,
				description,
				thumbnail,
				display,
				slug,
				gentkThumbnails,
				gentkDisplays,
				gentkIterations,
				gentkOwner,
				gentksPerPage,
				author,
				objktsCount,
				balance,
				page
			}
		};
	}
</script>

<script>
	import * as animateScroll from 'svelte-scrollto';
	export let name,
		display,
		thumbnail,
		description,
		author,
		slug,
		gentkDisplays,
		gentkThumbnails,
		gentkIterations,
		gentkOwner,
		gentksPerPage,
		objktsCount,
		balance,
		page,
		generativeId;

	let currentDisplay = thumbnail;
	let defaultDisplay;

	// use thumbnail as placeholder
	// before display is fully loaded
	function initialLoad() {
		if (!defaultDisplay) {
			defaultDisplay = new Image();
			defaultDisplay.src = display;
			defaultDisplay.onload = () => {
				currentDisplay = display;
			};
		}
	}

	let iteration = 0;
	function changeDisplay(index) {
		currentDisplay = gentkThumbnails[index];
		animateScroll.scrollToTop();
		iteration = gentkIterations[index];

		// when display image is fully loaded
		// replace the thumbnail placeholder
		const displayImg = new Image();
		displayImg.src = gentkDisplays[index];
		displayImg.onload = () => {
			currentDisplay = gentkDisplays[index];
		};
	}

	const totalPage = Math.ceil(objktsCount / gentksPerPage);

	let hideToggle = false;
	if (description.length < 100) hideToggle = true;

	const shortDescription = description.slice(0, 100);
	let descriptionExpand = false;

	function toggleDescription() {
		descriptionExpand = !descriptionExpand;
	}
</script>

<div class="flex flex-col">
	<div class="flex justify-between items-center m-3 align-bottom">
		<a href="/">
			<span class="font-mono">home</span>
		</a>

		<a href={slug}>
			<div class="flex bg-neutral-800 text-neutral-200 py-2 px-4 rounded-full">
				<span class="mr-3 font-mono">view on fxhash</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
					/>
				</svg>
			</div>
		</a>
	</div>

	<img
		class="mx-auto my-10 object-contain h-[60vh] md:h-[75vh] md:my-5"
		src={currentDisplay}
		use:initialLoad
		alt="generative artwork"
	/>

	<div class="max-w-sm mx-auto break-words mb-16 px-2">
		{#if iteration == 0}
			<h1 class="text-4xl font-bold">{name}</h1>
		{:else}
			<h1 class="text-4xl font-bold">{name} #{iteration}</h1>
		{/if}

		<div class="mb-6 break-all">
			<p>Artist: {author}</p>
			{#if iteration != 0}
				{#if !gentkOwner[iteration].name}
					<p class="">Owner: {gentkOwner[iteration].id}</p>
				{:else}
					<p class="">Owner: {gentkOwner[iteration].name}</p>
				{/if}
			{/if}
		</div>

		{#if !hideToggle}
			{#if !descriptionExpand}
				<div class="whitespace-pre-line">
					{shortDescription}...
				</div>
				<span class="hover:cursor-pointer font-mono" on:click={toggleDescription}
					>read more <svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 inline"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg></span
				>
			{:else}
				<div class="whitespace-pre-line">
					{description}
				</div>
				<span class="hover:cursor-pointer font-mono" on:click={toggleDescription}
					>read less <svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 inline"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
					</svg></span
				>
			{/if}
		{:else}
			<div class="whitespace-pre-line">
				{description}
			</div>
		{/if}
	</div>
	<div class="flex justify-center mb-16">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-3 w-3"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-3 w-3"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-3 w-3"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		</svg>
	</div>
	<div id="thumbnails" class="flex flex-wrap max-w-7xl mx-auto mb-16">
		{#each gentkThumbnails as thumbnail, index}
			<div class="basis-1/2 p-0.5 sm:basis-1/3 lg:basis-1/4">
				<img
					class="w-full h-auto hover:cursor-pointer hover:scale-[0.97] hover:rotate-2 transition-all"
					on:click={() => changeDisplay(index)}
					src={thumbnail}
					alt=""
				/>
			</div>
		{/each}
	</div>

	<div class="flex justify-center space-x-10 mb-16 font-mono">
		{#if page > 1}
			<a href="/generative/{generativeId}/?page={page - 1}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 inline"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
						clip-rule="evenodd"
					/>
				</svg>
				prev</a
			>
		{:else}
			<a class="invisible" href="/generative/{generativeId}/?page={page - 1}">prev</a>
		{/if}

		{#if page < totalPage}
			<a href="/generative/{generativeId}/?page={page + 1}"
				>more
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 inline"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
						clip-rule="evenodd"
					/>
					<path
						fill-rule="evenodd"
						d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</a>
		{:else}
			<a class="invisible" href="/generative/{generativeId}/?page={page + 1}">more</a>
		{/if}
	</div>
</div>
