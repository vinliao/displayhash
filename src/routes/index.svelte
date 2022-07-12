<script context="module">
	import { request, gql } from 'graphql-request';

	export async function load() {
		const ipfsGateway = 'https://gateway.fxhash2.xyz/ipfs/';
		const graphqlUrl = 'https://api.fxhash.xyz/graphql';

		const topQuery = gql`
			query Query($take: Int) {
				marketStats {
					generativeTokens(take: $take) {
						secVolumeTz
						generativeToken {
							id
							thumbnailUri
							name
						}
					}
				}
			}
		`;

		const hotQuery = gql`
			query Query($take: Int) {
				marketStats {
					generativeTokens(take: $take) {
						secVolumeTz7d
						generativeToken {
							id
							thumbnailUri
							name
						}
					}
				}
			}
		`;

		const newQuery = gql`
			query GenerativeTokens($take: Int) {
				generativeTokens(take: $take) {
					id
					name
					thumbnailUri
				}
			}
		`;

		const takeVariable = {
			take: 30
		};

		const mintableQuery = gql`
			query GenerativeTokens($take: Int, $filters: GenerativeTokenFilter) {
				generativeTokens(take: $take, filters: $filters) {
					id
					name
					thumbnailUri
				}
			}
		`;

		const mintableVariable = {
			take: 30,
			filters: {
				mintProgress_eq: 'ALMOST'
			}
		};

		// todo: thumbnails use ipfs gateway
		const topResponse = await request(graphqlUrl, topQuery, takeVariable);
		let top = [];
		topResponse.marketStats.generativeTokens.forEach((token) => {
			top.push({
				id: token.generativeToken.id,
				thumbnail: ipfsGateway + token.generativeToken.thumbnailUri.slice(7)
			});
		});

		const hotResponse = await request(graphqlUrl, hotQuery, takeVariable);
		let hot = [];
		hotResponse.marketStats.generativeTokens.forEach((token) => {
			hot.push({
				id: token.generativeToken.id,
				thumbnail: ipfsGateway + token.generativeToken.thumbnailUri.slice(7)
			});
		});

		const newResponse = await request(graphqlUrl, newQuery, takeVariable);
		let newGenerative = [];
		newResponse.generativeTokens.forEach((token) => {
			newGenerative.push({ id: token.id, thumbnail: ipfsGateway + token.thumbnailUri.slice(7) });
		});

		const mintableResponse = await request(graphqlUrl, mintableQuery, mintableVariable);
		let mintable = [];
		mintableResponse.generativeTokens.forEach((token) => {
			mintable.push({ id: token.id, thumbnail: ipfsGateway + token.thumbnailUri.slice(7) });
		});

		const bigCollectorQuery = gql`
			query GenerativeTokens($skip: Int) {
				marketStats {
					generativeTokens {
						highestSold
						generativeToken {
							objkts(skip: $skip) {
								owner {
									id
								}
							}
						}
					}
				}
			}
		`;

		const bigCollectorVariables = {
			skip: Math.floor(Math.random() * 100)
		};

		const bigCollector = await request(graphqlUrl, bigCollectorQuery, bigCollectorVariables);
		const bigCollectorAddress =
			bigCollector.marketStats.generativeTokens[0].generativeToken.objkts[0].owner.id;

		const collectorsCollectionQuery = gql`
			query User($userId: String, $take: Int) {
				user(id: $userId) {
					objkts(take: $take) {
						id
						name
						metadata
					}
				}
			}
		`;

		const collectorsCollectionVariables = {
			userId: bigCollectorAddress,
			take: 30
		};

		const collectorsCollection = await request(
			graphqlUrl,
			collectorsCollectionQuery,
			collectorsCollectionVariables
		);
		let bigCollection = [];
		console.log(collectorsCollection);
		collectorsCollection.user.objkts.forEach((token) => {
			bigCollection.push({ id: token.id, thumbnail: token.metadata.thumbnailUri });
		});

		return {
			status: 200,
			props: { hot, top, newGenerative, mintable, bigCollection }
		};
	}
</script>

<script>
	// shuffle list
	export let hot, top, newGenerative, mintable, bigCollection;
	const categories = [hot, top, newGenerative, mintable, bigCollection];
	const categoriesText = ['hot', 'top', 'new', 'mintable', "big collector's collection"];
</script>

{#each categories as category, index}
	<p>{categoriesText[index]}</p>
	<div class="flex space-x-1 overflow-x-scroll py-2">
		{#each category as item}
			<a href="/generative/{item.id}">
				<img loading="lazy" class="max-w-sm h-[37vh]" src={item.thumbnail} alt="generative artwork" /></a
			>
		{/each}
	</div>
{/each}
