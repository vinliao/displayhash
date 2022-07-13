// import { request, gql } from 'graphql-request';

// export async function get({ params, url }) {
//   const ipfsGateway = 'https://gateway.fxhash2.xyz/ipfs/';
//   const graphqlUrl = 'https://api.fxhash.xyz/graphql';
//   const slugUrl = 'https://fxhash.xyz/generative/slug/';
//   const query = gql`
// 			query ExampleQuery($slug: String, $take: Int, $skip: Int) {
// 				generativeToken(slug: $slug) {
// 					id
// 					name
// 					author {
// 						name
// 					}
// 					displayUri
// 					slug
// 					objktsCount
// 					balance
// 					metadata
// 					thumbnailUri
// 					objkts(take: $take, skip: $skip) {
// 						metadata
// 						iteration
// 						owner {
// 							name
// 							id
// 						}
// 					}
// 				}
// 			}
// 		`;
//   let page = url.searchParams.get('page');
//   page = Number(page);
//   const gentksPerPage = 50;
//   const generativeSlug = params.slug;
//   if (!page) page = 1;
//   const variables = {
//     slug: generativeSlug,
//     skip: (page - 1) * gentksPerPage,
//     take: gentksPerPage
//   };

//   const result = await request(graphqlUrl, query, variables);
//   const author = result.generativeToken.author.name;
//   const description = result.generativeToken.metadata.description;
//   const slug = slugUrl + result.generativeToken.slug;
//   const display = ipfsGateway + result.generativeToken.displayUri.slice(7);
//   const thumbnail = ipfsGateway + result.generativeToken.thumbnailUri.slice(7);
//   const objktsCount = result.generativeToken.objktsCount;
//   const balance = result.generativeToken.balance;

//   let gentkThumbnails = [];
//   let gentkDisplays = [];
//   let gentkIterations = [];
//   let gentkOwner = [];

//   result.generativeToken.objkts.forEach((objkt) => {
//     const gentkThumbnail = objkt.metadata.thumbnailUri;
//     gentkThumbnails.push(ipfsGateway + gentkThumbnail.slice(7));
//     gentkDisplays.push(ipfsGateway + objkt.metadata.displayUri.slice(7));
//     gentkIterations.push(objkt.iteration);
//     gentkOwner.push(objkt.owner);
//   });

//   return {
//     status: 200,
//     body: {
//       name: result.generativeToken.name,
//       description,
//       thumbnail,
//       display,
//       slug,
//       gentkThumbnails,
//       gentkDisplays,
//       gentkIterations,
//       gentkOwner,
//       gentksPerPage,
//       author,
//       objktsCount,
//       generativeSlug,
//       balance,
//       page
//     }
//   };
// }