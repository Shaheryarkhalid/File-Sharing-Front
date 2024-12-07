import { useState, useEffect } from "react";
import GetSingleFile from "./GetSingleFile";
//@ts-ignore
export default function UserUploadedFiles({uploaded}){
	const [ userFiles, setUserFiles ] = useState();
	useEffect(() => {
		(async () => {
			const files = await fetch('/api/file/userfiles', {
				method: 'GET',
				credentials: 'include',
				headers: {
				  'Content-Type': 'application/json',
				},
			  }).then(res => res.json()) 
			setUserFiles(files);
		})()
	},[uploaded])
	console.log(userFiles)
return(
	<div>
		<h3>Your Uploaded Files</h3>
		<span style={{ color: 'red' }}>{ 
			//@ts-ignore
			userFiles && !userFiles.success && userFiles.error 
			}</span>
		<div style={{ display: 'flex', flexWrap: 'wrap' }}> 	
			
		{	
			//@ts-ignore
			userFiles && userFiles.files && userFiles.files.map((file, index) => (
				<GetSingleFile key={index} file={file} />	
		))}
		</div>
	</div>
	)
}