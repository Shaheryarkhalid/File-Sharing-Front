import { useEffect, useState } from "react";
export default function GetSingleFile({ file }: { file: { name: string, views: string } })
{
	const [ fileUrl, setFileUrl ] = useState<string | null>(null);
	useEffect(()=>{
		(async ()=>{
			const url = `/api/file/single/${file.name}`
			const response = await fetch(url, {
				method: 'GET',
				credentials: 'include'
			})
			if(response.ok)
			{
				setFileUrl(url)
			}
		})()
	},[file])
	async function shareFile(fileName: string)
	{
		const response = await fetch('/api/file/share', { 
			credentials: 'include',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ fileName: fileName })
		})
		if(response.ok)
		{
			const result = await response.json();
			alert(result.sharedLink)
		}
	}
	return(
		<div
			style={{
				position: 'relative',
				margin: '10px',
				border: '1px solid #ddd',
				padding: '10px',
				width: '150px',
				height: '150px',
				overflow: 'hidden'
			}}
			>
			<div style={{ position: 'absolute', top: '5px', right: '5px' }}>
				<button
					onClick={() => shareFile(file.name)}
					style={{
						padding: '5px 10px',
						fontSize: '12px',
						cursor: 'pointer',
						backgroundColor: '#007bff',
						color: '#fff',
						border: 'none',
						borderRadius: '5px',
					}}
					>
					Share
				</button>
			</div>
			<div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
				<p
					style={{
						padding: '5px 5px',
						fontSize: '12px',
						cursor: 'pointer',
						backgroundColor: '#007bff',
						color: '#fff',
						border: 'none',
						borderRadius: '5px',
					}}
					>
					Views: { file && file.views && file.views }
				</p>
			</div>
			{fileUrl && (
				<div>
					<img src={fileUrl} alt="Uploaded File" style={{ width: '100%', maxHeight: '500px' }} />
				</div>
			)}
		</div>
	)
}