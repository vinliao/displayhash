<script context="module">
	import { request, gql } from 'graphql-request';

	// if params not integer, return error
	// todo: maybe can be transferred to endpoint
	export async function load({ params }) {
		const ipfsGateway = 'https://gateway.fxhash2.xyz/ipfs/';
		const url = 'https://api.fxhash.xyz/graphql';
		const slugUrl = 'https://fxhash.xyz/generative/slug/';
		const query = gql`
			query ExampleQuery($generativeTokenId: Float, $take: Int) {
				generativeToken(id: $generativeTokenId) {
					id
					name
					author {
						name
					}
					displayUri
					slug
					metadata
					thumbnailUri
					objkts(take: $take) {
						metadata
					}
				}
			}
		`;
		const variables = {
			generativeTokenId: Number(params.id),
			take: 50
		};

		const result = await request(url, query, variables);
		const author = result.generativeToken.author.name;
		const description = result.generativeToken.metadata.description;
		const slug = slugUrl + result.generativeToken.slug;
		const thumbnail = ipfsGateway + result.generativeToken.thumbnailUri.slice(7);
		const display = ipfsGateway + result.generativeToken.displayUri.slice(7);

		let iterationThumbnails = [];
		let gentkDisplays = [];

		result.generativeToken.objkts.forEach((objkt) => {
			const iterationThumbnail = objkt.metadata.thumbnailUri;
			iterationThumbnails.push(ipfsGateway + iterationThumbnail.slice(7));
			gentkDisplays.push(ipfsGateway + objkt.metadata.displayUri.slice(7));
		});

		return {
			status: 200,
			props: {
				name: result.generativeToken.name,
				description,
				thumbnail,
				display,
				slug,
				iterationThumbnails,
				gentkDisplays,
				author
			}
		};
	}
</script>

<script>
	import * as animateScroll from 'svelte-scrollto';
	export let name,
		thumbnail,
		display,
		iterationThumbnails,
		description,
		author,
		slug,
		gentkDisplays;

	function changeDisplay(index) {
		display = gentkDisplays[index];
		animateScroll.scrollToTop();
	}
</script>

<div class="flex flex-col">
	<div class="flex justify-between items-center m-3 align-bottom">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
		</svg>

		<a href={slug}>
			<div class="flex bg-neutral-800 text-neutral-200 py-2 px-4">
				<span class="mr-3">view on fxhash</span>
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

	<img class="mx-auto my-10 object-contain md:h-[75vh] md:mt-0" src={display} alt="" />
	<div class="max-w-sm mx-auto break-words mb-16 px-2">
		<h1 class="text-4xl font-bold">{name}</h1>
		<p>by {author}</p>
		<p>{description}</p>
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
	<div class="flex flex-wrap max-w-7xl mx-auto">
		{#each iterationThumbnails as thumbnail, index}
			<div class="basis-1/2 p-0.5 sm:basis-1/3 lg:basis-1/4">
				<img
					class="w-full h-auto hover:cursor-pointer"
					on:click={() => changeDisplay(index)}
					src={thumbnail}
					alt=""
				/>
			</div>
		{/each}
	</div>
</div>

<p class="text-center mt-16 mb-3"><a href="/about">about</a></p>
