import { useState } from "react";
import { UploadFiles, UserUploadedFiles } from "../components"
export default function Home()
{
	const [ uploaded, setUploaded ] = useState(0);
	return(
		<div style={{ height: '100%', width: '100%' }}>
				{
					//@ts-ignore
				    <UploadFiles setUploaded={setUploaded} />
				}
				<UserUploadedFiles uploaded={uploaded} />
		</div>
	)
}