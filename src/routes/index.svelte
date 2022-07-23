<script>
	import { goto } from '$app/navigation';

	let url = undefined;

	function search() {
		if (url) {
			let newString = url;
			newString = newString.replace('https://', '');
			newString = newString.replace('http://', '');
			newString = newString.replace('www.fxhash.xyz', '');
			newString = newString.replace('fxhash.xyz', '');

			goto(newString);
		}
	}

	const artworks = [
		'/generative/5',
		'/generative/8676',
		'/generative/slug/a-bugged-forest',
		'/generative/slug/linescapes-1',
		'/generative/slug/dragons',
		'/generative/slug/horizon(te)s',
		'/generative/slug/loom',
		'/generative/slug/smolskull'
	];
	function randomArtwork() {
		const randomIndex = Math.floor(Math.random() * artworks.length);
		return artworks[randomIndex]
	}
</script>

<div class="max-w-lg mx-auto text-center flex flex-col justify-center h-screen">
	<h1 class="text-4xl mb-10">A small fxhash museum</h1>

	<form on:submit|preventDefault={search} class="flex border-2 border-neutral-800 rounded-full mb-5">
		<input
			bind:value={url}
			type="text"
			class="grow mx-6 focus:outline-none focus:ring-0"
			placeholder="https://fxhash.xyz/generative/...."
		/>

		<button
			class="px-5 bg-neutral-800 rounded-full focus:outline-none"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-8 w-8 text-neutral-200 my-1.5"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</form>

	<div class="flex justify-center space-x-20 font-mono">
		<a href="/about">about</a>

		<a href="{randomArtwork()}">random artwork</a>
	</div>
</div>
