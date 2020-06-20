
export default async function(name){
	let buffer = null

	await this.$http.get('http://91.215.136.18:9797/common/files/'+name, { responseType: 'arraybuffer' })
	.then(res=> { buffer = res.data; })

	await this.$context.decodeAudioData(buffer, (buf)=>{ buffer = buf; })
 	
 	return buffer
}