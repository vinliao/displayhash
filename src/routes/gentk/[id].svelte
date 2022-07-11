<script context="module">
	import { request, gql } from 'graphql-request';

	// if params not integer, return error
	// todo: maybe can be transferred to endpoint
	export async function load({ params }) {
		const ipfsGateway = 'https://gateway.fxhash2.xyz/ipfs/';
		const url = 'https://api.fxhash.xyz/graphql';
		const query = gql`
			query ExampleQuery($generativeTokenId: Float, $take: Int) {
				generativeToken(id: $generativeTokenId) {
					id
					name
					displayUri
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
			take: 20
		};

		const result = await request(url, query, variables);
		const description = result.generativeToken.metadata.description;
		const thumbnail = ipfsGateway + result.generativeToken.thumbnailUri.slice(7);
		const display = ipfsGateway + result.generativeToken.displayUri.slice(7);
		console.log(result.generativeToken.objkts.length);

		// probably can be done with filter or something...
		let iterationThumbnails = [];
		// result.generativeToken.objkts somethingsomething
		result.generativeToken.objkts.forEach((objkt) => {
			const iterationThumbnail = objkt.metadata.thumbnailUri;
			iterationThumbnails.push(ipfsGateway + iterationThumbnail.slice(7));
		});

		// todo: combine uri with ipfsGateway

		return {
			status: 200,
			props: {
				name: result.generativeToken.name,
				description,
				thumbnail,
				display,
				iterationThumbnails
			}
		};
	}
</script>

<script>
	export let name, thumbnail, display, iterationThumbnails, description;
	console.log(name);
	console.log(thumbnail);
	console.log(display);
</script>

<div class="flex flex-col">
	<div class="h-screen py-5">
		<h1 class="text-center text-xl">{name}</h1>
		<img class="h-5/6 mx-auto object-contain my-5" src={display} alt="" />
		<div class="max-w-5xl mx-auto px-2">
			<p>---</p>
			<p>{description}</p>
			<p>---</p>
		</div>
	</div>

	<div class="flex flex-wrap max-w-7xl mx-auto">
		{#each iterationThumbnails as thumbnail, index}
			<div class="basis-full px-3 pb-10 sm:basis-1/2 lg:basis-1/3">
				<div class="flex justify-between items-center">
					<p class="text-2xl">#{index + 1}</p>
					<div class="flex">
						<!-- <svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 mr-3"
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
						</svg> -->

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
								d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
							/>
						</svg>
					</div>
				</div>
				<img class="w-full h-auto" src={thumbnail} alt="" />
			</div>
		{/each}
	</div>
</div>
