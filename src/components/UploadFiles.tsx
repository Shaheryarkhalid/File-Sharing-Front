import { SetStateAction, useState } from "react"; 	
export default function UploadFiles({ setUploaded }: { setUploaded: SetStateAction<number> }) {
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isDone, setIsDone] = useState(false);
	const handleFileUpload = async (event: Event) => {
		event.preventDefault();
	
		setIsLoading(true);
		setIsDone(false);
	
		const formData = new FormData();
		const fileInput = document.getElementById('uploadedFile');
		let file
		if(fileInput)
		{
			//@ts-ignore
			file = fileInput.files[0];
		}

		if (!file) {
		  setErrorMessage('Please select a file.');
		  setIsLoading(false);
		  return;
		}
	
		formData.append('uploadedFile', file);
	
		try {
		  const response = await fetch('/api/upload', {
			method: 'POST',
			credentials: 'include',
			body: formData,
		  });

		  const data = await response.json();
		  if (response.ok) {
			console.log('File uploaded successfully:', data);
			setIsDone(true);
			//@ts-ignore
			setUploaded(prev => Number(prev) + 1);
			//@ts-ignore
			document.getElementById('uploadForm').reset();
		  } else {
			console.log(data)
			setErrorMessage(data.error || 'Failed to upload file.');
		  }
		  setIsLoading(false);
		} catch (error) {
		  console.error('Error during file upload:', error);
		  setErrorMessage('An error occurred while uploading the file.');
		  setIsLoading(false);
		}
	  };
	return(
		<div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd' }}>
			<h3>Upload a File</h3>
			{
				//@ts-ignore
				<form onSubmit={handleFileUpload} id='uploadForm' >
					<input
						name='uploadedFile'
						id='uploadedFile'
						type="file"
						accept="image/*,video/*"
						style={{ marginBottom: '10px' }}
					/>
					<input type="submit" value={isLoading ? 'Loading...' : 'Upload'} disabled={isLoading} />  
				</form>
			}
			{isDone && <p style={{ color: 'green' }}>File uploaded successfully!</p>}
			{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
		</div>
	)
}